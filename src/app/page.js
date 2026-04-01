"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Check, Library, ShoppingCart, ExternalLink, Share2 } from 'lucide-react';

export default function GameDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [alreadyInLibrary, setAlreadyInLibrary] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);

  const demoGames = [
    { id: "13", name: "Catan", image: "/catan.jpg", year: "1995", desc: "Embark on a journey to settle the uncharted island of Catan. In this modern classic, players compete to build settlements, roads, and cities by trading and managing resources like wool, grain, and lumber.", price: "34.90" },
    { id: "233078", name: "Wingspan", image: "/wingspan.jpg", year: "2019", desc: "An award-winning strategy game about bird enthusiasts seeking to discover and attract the best birds to their network of wildlife preserves.", price: "49.50" },
    { id: "1406", name: "Monopoly", image: "/monopoly.jpg", year: "1933", desc: "The world’s most famous real estate board game. Bankrupt your rivals and own it all.", price: "24.90" },
    { id: "174430", name: "Gloomhaven", image: "/gloomhaven.jpg", year: "2017", desc: "Massiivne taktikaline koopaseiklus sügava looga.", price: "120.00" }
  ];

  const game = demoGames.find(g => g.id === id) || demoGames[0];

  useEffect(() => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const found = lib.find(item => String(item.id) === String(id));
    if (found) {
      setAlreadyInLibrary(true);
      setUserRating(found.rating || 0);
      setGameStatus(found.status || null);
    }
  }, [id]);

  const updateGameInLibrary = (updates) => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const index = lib.findIndex(item => String(item.id) === String(id));
    if (index !== -1) {
      lib[index] = { ...lib[index], ...updates };
      localStorage.setItem('myLibrary', JSON.stringify(lib));
    }
  };

  const addToCollection = () => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    if (!lib.find(item => String(item.id) === String(game.id))) {
      const newGame = { ...game, rating: 0, status: 'wishlist' };
      const updatedLib = [...lib, newGame];
      localStorage.setItem('myLibrary', JSON.stringify(updatedLib));
      setAlreadyInLibrary(true);
      setGameStatus('wishlist');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans tracking-tight">
      <div className="max-w-[1400px] mx-auto">
        
        {/* RETURN BUTTON */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/30 hover:text-orange-600 transition-all mb-12 uppercase text-[10px] font-black tracking-[0.3em]">
          <ArrowLeft size={16} strokeWidth={3} /> Return to Vault
        </button>

        <div className="grid lg:grid-cols-[450px_1fr] gap-12 md:gap-24">
          
          {/* LEFT: Image & Price */}
          <div className="space-y-8">
            <div className="relative aspect-[3/4] overflow-hidden border-8 border-white/5 bg-white/5">
              <img src={game.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={game.name} />
            </div>

            <div className="bg-white/5 p-8 border-l-4 border-orange-600 space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-black uppercase italic text-xs tracking-widest text-white/40">Market Price</p>
                <span className="text-3xl font-black text-white">{game.price}€</span>
              </div>
              
              <a href="#" className="flex items-center justify-between p-4 bg-orange-600 hover:bg-orange-700 transition-colors text-white group">
                <span className="font-black text-xs uppercase tracking-widest italic text-black">Acquire via Brain Games</span>
                <ExternalLink size={16} className="text-black" strokeWidth={3} />
              </a>
            </div>
          </div>
          
          {/* RIGHT: Content */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="bg-white text-black px-4 py-1 font-black text-[10px] uppercase tracking-widest italic">{game.year}</span>
            </div>

            <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-[0.85] text-white">
              {game.name}
            </h1>
            
            <p className="text-white/50 text-lg md:text-2xl leading-tight mb-12 font-medium max-w-2xl border-l border-white/10 pl-8 italic">
              {game.desc}
            </p>

            {/* ACTIONS */}
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-4">
                {!alreadyInLibrary ? (
                  <button onClick={addToCollection} className="bg-white text-black font-black py-6 px-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-colors w-full sm:w-auto">
                    <Library size={20} strokeWidth={3} /> Add to shelf
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-3 border-2 border-green-500 text-green-500 font-black py-6 px-10 text-xs uppercase tracking-[0.2em] w-full sm:w-auto italic">
                    <Check size={20} strokeWidth={3} /> In Your Vault
                  </div>
                )}
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="border border-white/20 text-white hover:border-white py-6 px-8 flex items-center justify-center transition-all w-full sm:w-auto">
                  <Share2 size={20} />
                </button>
              </div>

              {/* RATING & STATUS */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-1 transition-all duration-700 ${alreadyInLibrary ? 'opacity-100' : 'opacity-5 pointer-events-none'}`}>
                <div className="bg-white/5 p-6 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Assign Rating</p>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className="cursor-pointer transition-transform active:scale-90" fill={star <= userRating ? "#f97316" : "none"} stroke={star <= userRating ? "#f97316" : "white"} strokeWidth={2} onClick={() => { setUserRating(star); updateGameInLibrary({ rating: star }); }} />
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 p-6 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Vault Status</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setGameStatus('wishlist'); updateGameInLibrary({ status: 'wishlist' }); }} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${gameStatus === 'wishlist' ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/20'}`}>Backlog</button>
                    <button onClick={() => { setGameStatus('played'); updateGameInLibrary({ status: 'played' }); }} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${gameStatus === 'played' ? 'bg-green-600 text-white' : 'bg-white/5 text-white/20'}`}>Played</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - NÜÜD MAINITI SEES */}
        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-20">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-8 bg-orange-600"></div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">
                Gather. <span className="text-orange-600">Play.</span> Track.
              </p>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              © 2026 Aleksander Püüa. All rights reserved.
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">
              Data provided by BoardGameGeek
            </p>
            <p className="text-[10px] font-medium text-white/10 uppercase tracking-widest">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}