"use client";

import { useEffect, useState } from "react";
import { useConfirm } from "@/components/ConfirmModal";

type Device = { machine_id: string; name: string | null; activated_at: string | null; last_seen_at: string | null };
type DevicesResponse = { limit: number; devices: Device[] };

async function fetchDevices(): Promise<DevicesResponse> {
  const res = await fetch("/api/dotscramble/devices", { cache: "no-store" });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error || "Unable to load your devices.");
  return body;
}

function when(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** The computers DotScramble Max is activated on, with a way to free a slot. */
export default function DevicesCard() {
  const { confirm } = useConfirm();
  const [data, setData] = useState<DevicesResponse | null>(null);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const show = (result: Promise<DevicesResponse>) =>
    result
      .then((body) => { setData(body); setError(""); })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load your devices."));

  useEffect(() => { show(fetchDevices()); }, []);

  async function remove(device: Device) {
    const ok = await confirm(
      `${device.name || "This device"} will return to the Free plan the next time DotScramble checks in, and its slot becomes available right away.`,
      { title: "Remove this device?", confirmLabel: "Remove", variant: "danger" },
    );
    if (!ok) return;
    setRemoving(device.machine_id);
    try {
      const res = await fetch(`/api/dotscramble/devices/${device.machine_id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 404) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Unable to remove the device.");
      }
      await show(fetchDevices());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove the device.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold">Devices</h2>
        {data && (
          <span className="text-sm text-(--text-muted)">
            {data.devices.length} of {data.limit} in use
          </span>
        )}
      </div>
      <p className="text-sm text-(--text-muted) mb-4">
        Your account can use DotScramble Max on {data?.limit ?? 2} computers at a time. Remove one you no
        longer use (a reinstalled system counts as a new computer) to activate another.
      </p>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {!data && !error && <div className="h-16 rounded-lg bg-gray-500/10 animate-pulse" />}

      {data && data.devices.length === 0 && (
        <p className="text-sm text-(--text-muted)">No computer is activated yet.</p>
      )}

      {data && data.devices.length > 0 && (
        <ul className="divide-y divide-(--card-border)">
          {data.devices.map((device) => (
            <li key={device.machine_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{device.name || "Unnamed computer"}</p>
                <p className="text-xs text-(--text-muted)">
                  Activated {when(device.activated_at)} · Last check-in {when(device.last_seen_at)} ·{" "}
                  <span className="font-mono">{device.machine_id.slice(0, 8)}</span>
                </p>
              </div>
              <button
                onClick={() => remove(device)}
                disabled={removing === device.machine_id}
                className="self-start sm:self-auto px-3 py-1.5 text-sm rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
              >
                {removing === device.machine_id ? "Removing…" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
