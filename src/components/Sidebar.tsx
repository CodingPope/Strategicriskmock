'use client';

export default function Sidebar() {
  return (
    <aside className="bg-zinc-950 text-zinc-200 w-48 p-4 space-y-4">
      <h1 className="text-xl font-bold tracking-wide">VASARA</h1>
      <nav className="space-y-2">
        <a className="block hover:text-cyan-400" href="#">Dashboard</a>
        <a className="block hover:text-cyan-400" href="#">Exposures</a>
        <a className="block hover:text-cyan-400" href="#">Settings</a>
      </nav>
    </aside>
  );
}
