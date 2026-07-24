import Terminal from '@/components/Terminal/Terminal';
import AICommandPalette from '@/components/AI/AICommandPalette';
import FileExplorer from '@/components/FileExplorer/FileExplorer';

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0A0E1A] text-white">
      <FileExplorer />
      <Terminal />
      <AICommandPalette />
    </div>
  );
}