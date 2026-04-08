export default function Loading() {
  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-sand-200 border-t-moss-600 rounded-full animate-spin" />
        <p className="text-sm text-sand-400">Načítavam...</p>
      </div>
    </div>
  );
}
