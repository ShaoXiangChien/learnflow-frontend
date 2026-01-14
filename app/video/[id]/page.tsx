'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VideoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home since we're using infinite scroll now
    router.push('/');
  }, [router]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">▶</div>
        <div className="text-2xl font-black uppercase text-[#ccff00]">Redirecting...</div>
      </div>
    </div>
  );
}
