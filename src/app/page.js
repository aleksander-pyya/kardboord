"use client";
import { useState, useEffect } from 'react';
import { searchGames } from '@/lib/bgg';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, X } from 'lucide-react';

const recommendedGames = [
  { id: "233078", name: "Wingspan", image: "/wingspan.jpg", year: "2019" },
  { id: "1406", name: "Monopoly", image: "/monopoly.jpg", year: "1933"},
  { id: "13", name: "Catan", image: "/catan.jpg", year: "1995" }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myLibrary, setMyLibrary] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    setMyLibrary(saved);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const games = await searchGames(query);
    setResults(games);
    setLoading(false);
  };

  const clearSearch = () => {
    setResults([]);
    setQuery('');
  };

  const wishlistGames = myLibrary.filter(game => game.status === 'wishlist' || !game.status);
  const playedGames = myLibrary.filter(game => game.status === 'played');

  const removeFromLibrary = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure, you want to remove this game from your library?")) return;

    const currentLib = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    const newLib = currentLib.filter(item => String(item.id) !== String(id));

    setMyLibrary(newLib);
    localStorage.setItem('myLibrary', JSON.stringify(newLib));

    console.log("Eemaldatud mäng ID-ga:", id);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans tracking-tight">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER & LOGO */}
        <header className="flex justify-between items-start mb-20 md:mb-40">
          <Link href="/" className="group">
            <img src="/logo.png" alt="Kardboord" className="h-12 md:h-20 w-auto grayscale group-hover:grayscale-0 transition-all" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mt-2">Board Games Social Media App</p>
          </Link>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Job Fair Edition</p>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">v1.0.4</p>
          </div>
        </header>

        {/* SEARCH BAR - NÜÜD ALATI FOOKUSES */}
        <section className="mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH FOR BOARD GAMES..." 
              className="bg-transparent border-b-4 border-white/10 py-8 md:py-16 w-full outline-none focus:border-orange-600 transition-all text-3xl md:text-7xl font-black tracking-tighter placeholder:text-white/5 uppercase italic"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-6">
              {results.length > 0 && (
                <button type="button" onClick={clearSearch} className="text-white/20 hover:text-white transition-colors">
                  <X size={40} strokeWidth={3} />
                </button>
              )}
              <button type="submit" className="text-white/10 group-hover:text-orange-600 transition-colors">
                {loading ? <Loader2 className="animate-spin" size={40} /> : <ArrowRight size={50} strokeWidth={3} />}
              </button>
            </div>
          </form>
        </section>

        {/* 1. OTSINGUTULEMUSED (KÕIGE ÜLEVAL) */}
        {results.length > 0 && (
          <section className="mb-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-end justify-between mb-10 border-l-8 border-orange-600 pl-6">
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">Results</h2>
              <span className="text-orange-600 font-black text-xl md:text-2xl italic">/{results.length}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 bg-white/5 border border-white/5">
              {results.map((game) => (
                <Link href={`/game/${game.id}`} key={game.id} className="group bg-[#0c0c0c] relative aspect-[3/4] overflow-hidden">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="font-black text-sm md:text-xl uppercase italic leading-none">{game.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. SOOVITUSED (ILMUVAD AINULT KUI EI OTSI VÕI ON OTSINGU ALL) */}
        <section className="mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-l-8 border-white pl-6">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">Kardboord<br/><span className="text-orange-600">Picks</span></h2>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/20 mt-6 md:mt-0">Top Rated / Featured</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {recommendedGames.map(game => (
              <Link href={`/game/${game.id}`} key={game.id} className="group relative aspect-video md:aspect-square overflow-hidden bg-white/5">
                <img src={game.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100 grayscale group-hover:grayscale-0" alt={game.name} />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <span className="text-xs font-black tracking-widest text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">LEARN MORE —&gt;</span>
                  <h3 className="text-2xl md:text-4xl font-black uppercase italic leading-none">{game.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. KASUTAJA RIIUL */}
        {(wishlistGames.length > 0 || playedGames.length > 0) && (
          <section className="border-t border-white/10 pt-20">
             <div className="flex items-center justify-between mb-12">
               <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/20 text-orange-600">Your shelf</h2>
               <span className="text-[10px] font-bold text-white/10 uppercase italic">{myLibrary.length} games in total</span>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 md:gap-10">
                {myLibrary.map(game => (
                  <div key={game.id} className="group relative">
                    {/* KUSTUTAMISE NUPP */}
                    <button
                      onClick={(e) => removeFromLibrary(e, game.id)}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-none z-50 opacity-100 transition-all border-2 border-[#050505] active:scale-90"
                      type="button"
                    >
                      <X size={16} strokeWidth={4} />
                    </button>

                    <Link href={`/game/${game.id}`} className="block">
                      <div className="aspect-[2/3] bg-white/5 overflow-hidden mb-4 relative border border-white/5 group-hover:border-orange-600/50 transition-colors">
                        <img
                          src={game.image}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                          alt={game.name}
                        />

                        {/* STAATUSMÄRGIS (Täpike) */}
                        <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,1)] ${
                          game.status === 'played' ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors truncate">
                      {game.name}
                    </p>
                  </Link>
                </div>
                ))}
             </div>
          </section>
        )}

      </div>
    </main>
  );
}