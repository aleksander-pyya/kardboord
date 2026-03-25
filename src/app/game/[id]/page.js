"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Check, Library, ShoppingCart, ExternalLink } from 'lucide-react';

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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans tracking-tight">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-12 group uppercase text-[10px] font-black tracking-[0.2em]">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Tagasi
        </button>

        <div className="grid lg:grid-cols-[450px_1fr] gap-16">
          {/* VASAK POOL: Pilt ja Ostmine */}
          <div className="space-y-8">
            <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group">
              <img src={game.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={game.name} />
            </div>

            {/* --- OSTMISE SEKTSIOON --- */}
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-orange-500" size={20} />
                  <h3 className="font-black uppercase italic text-sm tracking-wider">Osta mäng</h3>
                </div>
                <span className="text-xl font-black text-white">al. {game.price}€</span>
              </div>
              
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group border border-white/5">
                  <span className="font-bold text-sm">Brain Games</span>
                  <div className="flex items-center gap-3 text-orange-500">
                    <span className="text-xs font-black">{game.price}€</span>
                    <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
                <a href="#" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group border border-white/5 opacity-60">
                  <span className="font-bold text-sm">Ludo.ee</span>
                  <div className="flex items-center gap-3 text-orange-500">
                    <span className="text-xs font-black">{(parseFloat(game.price) + 2).toFixed(2)}€</span>
                    <ExternalLink size={14} />
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* PAREM POOL: Info ja Tegevused */}
          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-orange-600/20 text-orange-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-orange-500/20">{game.year}</span>
              {alreadyInLibrary && <span className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase tracking-widest"><Check size={14} /> Teie valik</span>}
            </div>

            <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">{game.name}</h1>
            <p className="text-gray-400 text-xl leading-relaxed mb-12 max-w-xl font-medium">{game.desc}</p>

            <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
              <div className="flex flex-wrap gap-4">
                {!alreadyInLibrary ? (
                  <button onClick={addToCollection} className="bg-orange-600 hover:bg-orange-500 text-white font-black py-5 px-10 rounded-2xl transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-orange-600/20 text-xs uppercase tracking-widest">
                    <Library size={20} /> Lisa riiulisse
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-green-600/20 border border-green-500/30 text-green-500 font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest shadow-inner">
                    <Check size={20} strokeWidth={3} /> Mäng on salvestatud
                  </div>
                )}
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link kopeeritud!"); }} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black py-5 px-8 rounded-2xl flex items-center gap-3 text-xs uppercase tracking-widest transition-all">
                  Jaga sõpradega
                </button>
              </div>

              {/* HINNANG JA STAATUS */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${alreadyInLibrary ? 'opacity-100 translate-y-0' : 'opacity-20 pointer-events-none translate-y-4'}`}>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-5">Sinu hinnang</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={28} className="cursor-pointer transition-all hover:scale-125 active:scale-90" fill={star <= userRating ? "#f97316" : "none"} stroke={star <= userRating ? "#f97316" : "currentColor"} onClick={() => { setUserRating(star); updateGameInLibrary({ rating: star }); }} />
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-5">Mängu staatus</p>
                  <div className="flex gap-3">
                    <button onClick={() => { setGameStatus('wishlist'); updateGameInLibrary({ status: 'wishlist' }); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${gameStatus === 'wishlist' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}>Mänguootel</button>
                    <button onClick={() => { setGameStatus('played'); updateGameInLibrary({ status: 'played' }); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${gameStatus === 'played' ? 'bg-green-600 text-white shadow-lg' : 'bg-white/5 text-gray-500'}`}>Mängitud</button>
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