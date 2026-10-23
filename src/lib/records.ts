import { getPool, encode, decode, newId, databaseError, type Data } from "./postgres";

type Options = { select?: string; sort?: Record<string, number>; skip?: number; limit?: number; populate?: string };
type Model<T extends RecordBase> = {
  new(data: Data, stored?: boolean): T;
  collection: string; hidden: string[]; references: string[]; timestamps: boolean; updatedTimestamp: boolean;
};
const originals = new WeakMap<RecordBase, Data>();
const freshRecords = new WeakSet<RecordBase>();
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export class RecordQuery<T> implements PromiseLike<T> {
  private options: Options = {};
  constructor(private run: (options: Options) => Promise<T>) {}
  select(fields: string) { this.options.select = fields; return this; }
  sort(sort: Record<string, number>) { this.options.sort = sort; return this; }
  skip(skip: number) { this.options.skip = Math.max(0, skip); return this; }
  limit(limit: number) { this.options.limit = Math.max(1, Math.min(limit, 1000)); return this; }
  populate(field: string, _fields: string) { if (field !== "userId") throw new Error("Unsupported relation"); this.options.populate = field; return this; }
  then<TResult1 = T, TResult2 = never>(yes?: ((v: T) => TResult1 | PromiseLike<TResult1>) | null, no?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2> {
    return this.run({ ...this.options }).then(yes, no);
  }
}
function project(data: Data, hidden: string[], selection?: string): Data {
  const fields = selection?.split(/\s+/).filter(Boolean) ?? [];
  const included = fields.filter(x => !x.startsWith("-") && !x.startsWith("+"));
  let result = included.length ? Object.fromEntries(Object.entries(data).filter(([k]) => k === "_id" || included.includes(k))) : { ...data };
  for (const k of hidden) if (!fields.includes("+" + k) && !included.includes(k)) delete result[k];
  for (const k of fields.filter(x => x.startsWith("-"))) delete result[k.slice(1)];
  return result;
}
async function hydrate<T extends RecordBase>(model: Model<T>, raw: unknown, options: Options): Promise<T> {
  const data = project(decode(raw) as Data, model.hidden, options.select);
  const doc = new model(data, true);
  if (options.populate) await doc.populate(options.populate, "name image");
  return doc;
}
async function find<T extends RecordBase>(model: Model<T>, filter: Data, options: Options, single: boolean): Promise<T[]> {
  const params: unknown[] = [model.collection, JSON.stringify(encode(filter, model.references))];
  let sql = "SELECT data FROM ds_documents WHERE collection=$1 AND ($2::jsonb#>>'{_id,$oid}' IS NULL OR id=$2#>>'{_id,$oid}') AND ds_matches(data,$2::jsonb)";
  const sorting = Object.entries(options.sort ?? {});
  if (sorting.length) {
    sql += " ORDER BY " + sorting.map(([field, direction]) => {
      if (!/^[a-zA-Z0-9_.]+$/.test(field)) throw new Error("Invalid sort field");
      params.push(field.split("."));
      return `ds_scalar(data#>$${params.length}::text[]) ${direction < 0 ? "DESC NULLS LAST" : "ASC NULLS FIRST"}`;
    }).join(",");
  } else sql += " ORDER BY id";
  params.push(single ? 1 : options.limit ?? 1000); sql += ` LIMIT $${params.length}`;
  params.push(options.skip ?? 0); sql += ` OFFSET $${params.length}`;
  try { const result = await getPool().query(sql, params); return await Promise.all(result.rows.map(r => hydrate(model, r.data, options))); }
  catch (e) { return databaseError(e); }
}
function updatePatch(model: Model<RecordBase>, update: Data): Data {
  let patch = Object.keys(update).some(k => k.startsWith("$")) ? structuredClone(update) : { $set: { ...update } };
  if (model.updatedTimestamp) patch = { ...patch, $set: { ...(patch.$set as Data), updatedAt: new Date() } };
  return patch;
}

export class RecordBase {
  static collection: string;
  static hidden: string[] = [];
  static references: string[] = [];
  static timestamps = true;
  static updatedTimestamp = true;
  declare _id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  constructor(data: Data, stored = false) {
    Object.assign(this, data);
    if (!this._id) this._id = newId();
    if (!stored) freshRecords.add(this);
    originals.set(this, structuredClone(this.toObject()));
  }
  get id() { return this._id; }
  get isNew() { return freshRecords.has(this); }
  toObject(): Data { return Object.fromEntries(Object.entries(this)); }
  toJSON(): Data { return this.toObject(); }
  isModified(field: string) { return freshRecords.has(this) || !equal((this as unknown as Data)[field], originals.get(this)?.[field]); }
  protected async beforeSave() {}
  async save(): Promise<this> {
    const model = this.constructor as unknown as Model<this>;
    await this.beforeSave();
    const data = this.toObject();
    const before = originals.get(this) ?? {};
    const now = new Date();
    if (model.timestamps && freshRecords.has(this) && !data.createdAt) data.createdAt = now;
    if (model.updatedTimestamp) data.updatedAt = now;
    try {
      if (freshRecords.has(this)) {
        await getPool().query("INSERT INTO ds_documents(collection,id,data) VALUES($1,$2,$3::jsonb)", [model.collection, this._id, JSON.stringify(encode(data, model.references))]);
        freshRecords.delete(this);
      } else {
        // Patch only loaded, changed fields; never replace Core's billing/quota fields
        // from a projected account record. Session invalidation uses atomic $inc.
        const set: Data = {}, unset: Data = {};
        for (const [k, v] of Object.entries(data)) if (k !== "_id" && !equal(v, before[k])) { if (v === undefined) unset[k] = ""; else set[k] = v; }
        for (const k of Object.keys(before)) if (!(k in data) && k !== "_id") unset[k] = "";
        const patch = { $set: set, $unset: unset };
        const result = await getPool().query("SELECT * FROM ds_write($1,$2::jsonb,$3::jsonb,false,false,$4)", [model.collection, JSON.stringify(encode({ _id: this._id })), JSON.stringify(encode(patch, model.references)), newId()]);
        if (!result.rowCount) throw new Error("Record no longer exists");
      }
      Object.assign(this, data); originals.set(this, structuredClone(this.toObject())); return this;
    } catch (e) { return databaseError(e); }
  }
  async populate(field: string, _fields: string): Promise<this> {
    if (field !== "userId") throw new Error("Unsupported relation");
    const id = (this as unknown as Data)[field];
    if (typeof id !== "string") return this;
    const r = await getPool().query("SELECT data->'name' AS name,data->'image' AS image FROM ds_documents WHERE collection='users' AND id=$1", [id]);
    (this as unknown as Data)[field] = r.rows[0] ? { _id: id, name: r.rows[0].name, image: r.rows[0].image } : null;
    return this;
  }
  static find<T extends RecordBase>(this: Model<T>, filter: Data = {}) { return new RecordQuery<T[]>(options => find(this, filter, options, false)); }
  static findOne<T extends RecordBase>(this: Model<T>, filter: Data = {}) { return new RecordQuery<T | null>(async options => (await find(this, filter, options, true))[0] ?? null); }
  static findById<T extends RecordBase>(this: Model<T>, id: string) { return new RecordQuery<T | null>(async options => (await find(this, { _id: id }, options, true))[0] ?? null); }
  static async create<T extends RecordBase>(this: Model<T>, data: Data): Promise<T> { const doc = new this(data); await doc.save(); return doc; }
  static async countDocuments<T extends RecordBase>(this: Model<T>, filter: Data = {}): Promise<number> {
    const r = await getPool().query("SELECT count(*)::int AS count FROM ds_documents WHERE collection=$1 AND ds_matches(data,$2::jsonb)", [this.collection, JSON.stringify(encode(filter, this.references))]); return r.rows[0].count;
  }
  static findOneAndUpdate<T extends RecordBase>(this: Model<T>, filter: Data, update: Data, config: { upsert?: boolean; returnDocument?: string; runValidators?: boolean; setDefaultsOnInsert?: boolean } = {}) {
    return new RecordQuery<T | null>(async options => {
      const patch = updatePatch(this, update);
      try {
        const r = await getPool().query("SELECT * FROM ds_write($1,$2::jsonb,$3::jsonb,$4,false,$5)", [this.collection, JSON.stringify(encode(filter, this.references)), JSON.stringify(encode(patch, this.references)), config.upsert ?? false, newId()]);
        const raw = r.rows[0]?.[config.returnDocument === "after" ? "after_data" : "before_data"];
        return raw ? await hydrate(this, raw, options) : null;
      } catch (e) { return databaseError(e); }
    });
  }
  static findOneAndDelete<T extends RecordBase>(this: Model<T>, filter: Data) {
    return new RecordQuery<T | null>(async options => {
      try { const r = await getPool().query("SELECT ds_delete($1,$2::jsonb,false) AS data", [this.collection, JSON.stringify(encode(filter, this.references))]); return r.rows[0] ? await hydrate(this, r.rows[0].data, options) : null; }
      catch (e) { return databaseError(e); }
    });
  }
}
