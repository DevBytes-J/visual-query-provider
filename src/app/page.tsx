import { QueryCanvas } from '@/components/query-builder/QueryCanvas';
import { SplashScreen } from '@/components/SplashScreen';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F1E9] p-4 sm:p-6 md:p-8">
      <SplashScreen />
      <QueryCanvas />
    </main>
  );
}
