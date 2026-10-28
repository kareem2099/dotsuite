const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500", processing: "bg-blue-500/10 text-blue-400",
  failed: "bg-red-500/10 text-red-500", approved: "bg-green-500/10 text-green-500", denied: "bg-gray-500/10 text-gray-400",
};

/** A refund request's status. */
export default function StatusPill({ status }: { status: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${STATUS_STYLE[status] ?? ""}`}>{status}</span>;
}
