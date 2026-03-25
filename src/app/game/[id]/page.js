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
    { id: "13", name: "Catan", image: "/catan.jpg", year: "1995", desc: "Klassikaline strateegiamäng, kus kaubeldakse ressurssidega.", price: "34.99" },
    { id: "233078", name: "Wingspan", image: "/wingspan.jpg", year: "2019", desc: "Kaunis lauamäng lindude kogumisest ja pesitsemisest.", price: "49.50" },
    { id: "1406", name: "Monopoly", image: "/monopoly.jpg", year: "1933", desc: "Kinnisvaramäng, mis on tuntud peretülide poolest.", price: "24.90" },
    { id: "174430", name: "Gloomhaven", image: "/catan.jpg", year: "2017", desc: "Massiivne taktikaline koopaseiklus sügava looga.", price: "120.00" }
  ];

  const game = demoGames.find(g => g.id === id) || demoGames[0];

  useEffect(() => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const found = lib.find(item => item.id === id);
    if (found) {
      setAlreadyInLibrary(true);
      setUserRating(found.rating || 0);
      setGameStatus(found.status || null);
    }
  }, [id]);

  const updateGameInLibrary = (updates) => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const index = lib.findIndex(item => item.id === id);
    if (index !== -1) {
      lib[index] = { ...lib[index], ...updates };
      localStorage.setItem('myLibrary', JSON.stringify(lib));
    }
  };

  const addToCollection = () => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    if (!lib.find(item => item.id === game.id)) {
      const newGame = { ...game, rating: 0, status: 'wishlist' };
      localStorage.setItem('myLibrary', JSON.stringify([...lib, newGame]));
      setAlreadyInLibrary(true);
      setGameStatus('wishlist');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans tracking-tight">
      <div className="max-w-6xl mx-auto">
        
        {/* Tagasi nupp - väiksem mobiilis */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-6 md:mb-12 uppercase text-[9px] font-black tracking-widest">
          <ArrowLeft size={14} /> Tagasi
        </button>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8 md:gap-16">
          
          {/* VASAK POOL: Pilt ja Ostunupud */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] md:aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img src={game.image} className="w-full h-full object-cover" alt={game.name} />
            </div>

            {/* OSTMISE SEKTSIOON - Kompaktne mobiilis */}
            <div className="bg-[#111] p-5 md:p-8 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-orange-500" size={16} />
                  <h3 className="font-black uppercase italic text-[10px] tracking-wider">Osta mäng</h3>
                </div>
                <span className="text-lg font-black text-white">{game.price}€</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <a href="#" className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="font-bold text-xs uppercase tracking-tighter">Brain Games</span>
                  <ExternalLink size={12} className="text-orange-500" />
                </a>
              </div>
            </div>
          </div>
          
          {/* PAREM POOL: Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-orange-500/20">{game.year}</span>
            </div>

            {/* Pealkiri: 3xl mobiilis, 7xl desktopis */}
            <h1 className="text-3xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 md:mb-8 leading-tight">{game.name}</h1>
            
            <p className="text-gray-400 text-sm md:text-xl leading-relaxed mb-8 md:mb-12 font-medium opacity-80">{game.desc}</p>

            {/* TEGEVUSED */}
            <div className="space-y-6 bg-white/[0.03] p-5 md:p-8 rounded-3xl border border-white/5">
              <div className="flex flex-col sm:flex-row gap-3">
                {!alreadyInLibrary ? (
                  <button onClick={addToCollection} className="bg-orange-600 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/20 w-full">
                    <Library size={18} /> Lisa riiulisse
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 bg-green-600/20 border border-green-500/30 text-green-500 font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest w-full">
                    <Check size={18} /> Salvestatud
                  </div>
                )}
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link kopeeritud!"); }} className="bg-white/5 text-white border border-white/10 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest w-full sm:w-auto">
                  <Share2 size={18} />
                </button>
              </div>

              {/* HINNANG JA STAATUS - Kõrvuti ka mobiilis */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 ${alreadyInLibrary ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Sinu hinnang</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={20} className="cursor-pointer" fill={star <= userRating ? "#f97316" : "none"} stroke={star <= userRating ? "#f97316" : "currentColor"} onClick={() => { setUserRating(star); updateGameInLibrary({ rating: star }); }} />
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Staatus</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setGameStatus('wishlist'); updateGameInLibrary({ status: 'wishlist' }); }} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${gameStatus === 'wishlist' ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}>Mänguootel</button>
                    <button onClick={() => { setGameStatus('played'); updateGameInLibrary({ status: 'played' }); }} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${gameStatus === 'played' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-500'}`}>Mängitud</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}