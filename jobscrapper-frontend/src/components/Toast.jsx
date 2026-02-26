export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const tone =
    toast.type === "error"
      ? "bg-rose-600 text-white"
      : toast.type === "success"
        ? "bg-emerald-600 text-white"
        : "bg-slate-900 text-white";

  return (
    <div className={`fixed right-6 top-6 z-50 rounded-xl px-4 py-3 shadow-soft ${tone}`}>
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={onClose}
          className="rounded px-2 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}
