"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Check, Library, ExternalLink, Share2 } from 'lucide-react';

export default function GameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [alreadyInLibrary, setAlreadyInLibrary] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [game, setGame] = useState(null);

  // See massiiv on tagavaraks, kui API parasjagu ei vasta
  const demoGames = [
    { id: "13", name: "Catan", image: "/catan.jpg", year: "1995", desc: "Settlers of Catan is a modern classic. Trade, build and settle on the island.", price: "34.90" },
    { id: "233078", name: "Wingspan", image: "/wingspan.jpg", year: "2019", desc: "A bird-collection engine-building game.", price: "49.50" }
  ];

  useEffect(() => {
    // 1. Kontrolli localStorage
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const found = lib.find(item => String(item.id) === String(id));
    
    if (found) {
      setGame(found);
      setAlreadyInLibrary(true);
      setUserRating(found.rating || 0);
      setGameStatus(found.status || 'wishlist');
    } else {
      // Kui pole riiulil, võta demo andmetest või asenda API-ga
      const demo = demoGames.find(g => String(g.id) === String(id));
      setGame(demo || demoGames[0]);
    }
  }, [id]);

  const updateLibrary = (updates) => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const index = lib.findIndex(item => String(item.id) === String(id));
    if (index !== -1) {
      lib[index] = { ...lib[index], ...updates };
      localStorage.setItem('myLibrary', JSON.stringify(lib));
    }
  };

  const addToCollection = () => {
    const lib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    if (!lib.find(item => String(item.id) === String(id))) {
      const newGame = { ...game, rating: 0, status: 'wishlist' };
      localStorage.setItem('myLibrary', JSON.stringify([...lib, newGame]));
      setAlreadyInLibrary(true);
      setGameStatus('wishlist');
    }
  };

  if (!game) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans italic">
      <div className="max-w-[1400px] mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/30 hover:text-orange-600 transition-all mb-12 uppercase text-[10px] font-black tracking-[0.4em]">
          <ArrowLeft size={16} strokeWidth={3} /> Return to Vault
        </button>

        <div className="grid lg:grid-cols-[450px_1fr] gap-12 md:gap-24">
          <div className="space-y-8">
            <div className="aspect-[3/4] border-8 border-white/5 bg-white/5 overflow-hidden">
              <img src={game.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="bg-white/5 p-8 border-l-4 border-orange-600">
               <span className="text-3xl font-black">{game.price || "45.00"}€</span>
               <a href="#" className="flex justify-between items-center mt-4 bg-orange-600 p-4 text-black font-black uppercase text-[10px]">Buy Now <ExternalLink size={14}/></a>
            </div>
          </div>

          <div>
            <span className="bg-white text-black px-4 py-1 font-black text-[10px] uppercase tracking-widest">{game.year}</span>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] my-8">{game.name}</h1>
            <p className="text-white/50 text-lg md:text-2xl leading-tight mb-12 border-l border-white/10 pl-8 max-w-2xl">{game.desc}</p>

            <div className="space-y-8 bg-white/5 p-8 border border-white/5">
              {!alreadyInLibrary ? (
                <button onClick={addToCollection} className="w-full bg-white text-black font-black py-6 uppercase tracking-widest hover:bg-orange-600 transition-colors">Add to Vault</button>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 text-green-500 uppercase font-black text-xs tracking-widest border-2 border-green-500/20 p-4 justify-center italic">
                    <Check size={18} /> In Your Vault
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 mb-3 tracking-widest">Rating</p>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={20} fill={s <= userRating ? "#ea580c" : "none"} stroke={s <= userRating ? "#ea580c" : "white"} className="cursor-pointer" onClick={() => {setUserRating(s); updateLibrary({rating: s})}} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-black/40 p-4 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 mb-3 tracking-widest">Status</p>
                      <div className="flex gap-2">
                        <button onClick={() => {setGameStatus('wishlist'); updateLibrary({status: 'wishlist'})}} className={`flex-1 py-2 text-[9px] font-black uppercase ${gameStatus === 'wishlist' ? 'bg-orange-600' : 'bg-white/5'}`}>Backlog</button>
                        <button onClick={() => {setGameStatus('played'); updateLibrary({status: 'played'})}} className={`flex-1 py-2 text-[9px] font-black uppercase ${gameStatus === 'played' ? 'bg-green-600' : 'bg-white/5'}`}>Played</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}