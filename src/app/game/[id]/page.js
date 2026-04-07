"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Check, Library } from 'lucide-react';

export default function GameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [alreadyInLibrary, setAlreadyInLibrary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Kontrolli localStoraget
      const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
      const found = lib.find(item => String(item.id) === String(id));
      
      if (found) {
        setGame(found);
        setAlreadyInLibrary(true);
      } else {
        // 2. Küsi CSV-st ID kaudu
        const res = await fetch(`/api/search?query=${id}`);
        const data = await res.json();
        if (data.length > 0) setGame(data[0]);
      }
    };
    fetchData();
  }, [id]);

  const addToLibrary = () => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const newGame = { ...game, status: 'BACKLOG', rating: 0 };
    localStorage.setItem('myLibrary', JSON.stringify([...lib, newGame]));
    setAlreadyInLibrary(true);
  };

  if (!game) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-black italic uppercase tracking-widest">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans italic selection:bg-orange-600">
      <div className="max-w-[1400px] mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/30 hover:text-orange-600 transition-all mb-12 uppercase text-[10px] font-black tracking-[0.4em]">
          <ArrowLeft size={16} strokeWidth={3} /> Return to Vault
        </button>

        <div className="grid lg:grid-cols-[500px_1fr] gap-12 md:gap-24 mb-40">
          <div className="relative aspect-[3/4] border-[12px] border-white/5 bg-white/5 overflow-hidden">
            <img src={game.image} className="w-full h-full object-cover" alt={game.name} />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-orange-600 text-black px-4 py-1 font-black text-xs uppercase italic">Rank #{game.rank}</span>
              <span className="text-white/30 font-black text-xs uppercase tracking-widest">{game.year}</span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-12">{game.name}</h1>
            
            {!alreadyInLibrary ? (
              <button onClick={addToLibrary} className="w-full md:w-max bg-white text-black font-black py-8 px-16 text-xl uppercase tracking-widest hover:bg-orange-600 transition-all transform active:scale-95">
                Add to Shelf
              </button>
            ) : (
              <div className="flex items-center gap-4 text-green-500 border-2 border-green-500 w-max px-12 py-6 font-black uppercase italic tracking-widest">
                <Check size={24} /> Already in Vault
              </div>
            )}
          </div>
        </div>
        
        {/* Footer siia alla nagu alguses tegime */}
      </div>
    </main>
  );
}