import { QueryCanvas } from '@/components/query-builder/QueryCanvas';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F1E9] p-2 sm:p-4 md:p-8 flex items-center justify-center">
      <QueryCanvas />
    </main>
  );
}
