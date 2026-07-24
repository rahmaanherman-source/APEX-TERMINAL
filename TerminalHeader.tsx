'use client';

export default function TerminalHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-red-500 rounded-full" />
      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
      <div className="w-3 h-3 bg-green-500 rounded-full" />
      <span className="ml-4 text-sm text-gray-400">APEX Terminal</span>
    </div>
  );
}