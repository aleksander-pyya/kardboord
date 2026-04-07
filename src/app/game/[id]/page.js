"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GameDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Varuvariant pildile
  const fallbackImageUrl = `https://cf.geekdo-images.com/itemrep/img/id${id}-150.jpg`;

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // Nüüd toob see üks päring nii andmed CSV-st kui ka pildi BGG-st
        const res = await fetch(`/api/bgg?id=${id}`);
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        setGame(data);

        // Kontrollime vaulti olekut
        const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]');
        if (saved.some(g => String(g.id) === String(id))) {
          setAdded(true);
        }
      } catch (err) {
        console.error("Viga laadimisel:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGameDetails();
  }, [id]);

  const addToVault = () => {
    const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    
    const gameToSave = {
      id: game.id,
      name: game.name,
      year: game.yearpublished,
      rank: game.rank,
      image: game.image || fallbackImageUrl,
      status: 'WANT TO PLAY'
    };

    if (!saved.some(g => String(g.id) === String(game.id))) {
      const updated = [...saved, gameToSave];
      localStorage.setItem('myLibrary', JSON.stringify(updated));
      setAdded(true);
      router.push('/');
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-20 font-black italic animate-pulse uppercase tracking-[0.5em]">Syncing Database...</div>;
  if (!game) return <div className="min-h-screen bg-black text-white p-20 font-black italic text-center uppercase">Game Not Found.</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans italic selection:bg-orange-600 p-6 md:p-20">
      <Link href="/" className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-12 block hover:text-white transition-all">
        ← BACK TO DATABASE
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        {/* VASAK POOL: PILT */}
        <div className="w-full md:w-1/3">
          <div className="aspect-[3/4] bg-white/5 border border-white/10 relative group overflow-hidden">
            <img 
              src={game.image || fallbackImageUrl} 
              alt={game.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = fallbackImageUrl;
                e.target.onerror = () => {
                  e.target.src = "https://via.placeholder.com/600x800?text=IMAGE+NOT+FOUND";
                };
              }}
            />
            <div className="absolute top-0 right-0 bg-orange-600 text-black px-6 py-3 font-black text-4xl shadow-2xl z-10">
              #{game.rank}
            </div>
          </div>
        </div>

        {/* PAREM POOL: INFO */}
        <div className="w-full md:w-2/3 flex flex-col justify-between">
          <div>
            <h1 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter leading-[0.8] mb-8 break-words text-white">
              {game.name}
            </h1>
            
            <div className="flex flex-wrap gap-8 mb-12 border-y border-white/5 py-12">
              <div>
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-4 italic">Release</p>
                <p className="text-4xl font-black">{game.yearpublished}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-4 italic">BGG Rating</p>
                <p className="text-4xl font-black text-orange-600">{Number(game.average).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-4 italic">Voters</p>
                <p className="text-4xl font-black">{game.usersrated?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
             
             <button 
               onClick={addToVault}
               disabled={added}
               className={`w-full p-6 font-black uppercase text-xl transition-all duration-500 border-2 ${
                 added 
                 ? 'border-white/10 text-white/10 bg-transparent cursor-default' 
                 : 'bg-orange-600 border-orange-600 text-black hover:bg-white hover:border-white shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:shadow-orange-600/50'
               }`}
             >
               {added ? 'STASHED IN VAULT' : 'ADD TO PERSONAL VAULT'}
             </button>
          </div>
        </div>
    </main>
  );
}