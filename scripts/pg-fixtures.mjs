/** Test-only fixture access. Tests call real HTTP handlers against PostgreSQL. */
import pg from 'pg';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {BSON,ObjectId}=require('mongodb');
export {ObjectId};
const pack=v=>JSON.stringify(BSON.EJSON.serialize(v,{relaxed:false}));
const unpack=v=>BSON.EJSON.deserialize(v,{relaxed:false});
export class PgFixtureClient {
 constructor(url){this.url=url;const u=new URL(url);if(!['127.0.0.1','localhost'].includes(u.hostname)||!u.pathname.startsWith('/dotsuite_billing_test_'))throw Error('Fixtures require an isolated local test database');this.pool=new pg.Pool({connectionString:url,max:10});}
 async connect(){await this.pool.query('SELECT 1');}
 async close(){await this.pool.end();}
 db(name){if(new URL(this.url).pathname!==`/${name}`)throw Error('Fixture database mismatch');return{collection:c=>this.collection(c)};}
 collection(c){const pool=this.pool;return {
  async insertOne(doc){doc={...doc,_id:doc._id??new ObjectId()};await pool.query('INSERT INTO ds_documents(collection,id,data)VALUES($1,$2,$3::jsonb)',[c,String(doc._id),pack(doc)]);return{insertedId:doc._id};},
  async insertMany(docs){for(const d of docs)await this.insertOne(d);},
  async updateOne(f,p){const r=await pool.query('SELECT * FROM ds_write($1,$2::jsonb,$3::jsonb,false,false,$4)',[c,pack(f),pack(p),String(new ObjectId())]);return{matchedCount:r.rowCount,modifiedCount:r.rowCount};},
  async findOne(f){const r=await pool.query('SELECT data FROM ds_documents WHERE collection=$1 AND ds_matches(data,$2::jsonb) LIMIT 1',[c,pack(f)]);return r.rows[0]?unpack(r.rows[0].data):null;},
  find(f={}){return{toArray:async()=>{const r=await pool.query('SELECT data FROM ds_documents WHERE collection=$1 AND ds_matches(data,$2::jsonb)',[c,pack(f)]);return r.rows.map(r=>unpack(r.data));}};},
  async deleteOne(f){const r=await pool.query('SELECT * FROM ds_delete($1,$2::jsonb,false)',[c,pack(f)]);return{deletedCount:r.rowCount};},
  async deleteMany(f){const r=await pool.query('SELECT * FROM ds_delete($1,$2::jsonb,true)',[c,pack(f)]);return{deletedCount:r.rowCount};},
 };}
}
