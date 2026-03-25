"use client";
import { useState, useEffect } from 'react';
import { searchGames } from '@/lib/bgg';
import Link from 'next/link';
import { Search, Star, Loader2, Clock, CheckCircle2, LayoutGrid } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myLibrary, setMyLibrary] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    setMyLibrary(saved);
  }, []);

  const removeFromLibrary = (id) => {
    const newLib = myLibrary.filter(item => item.id !== id);
    setMyLibrary(newLib);
    localStorage.setItem('myLibrary', JSON.stringify(newLib));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const games = await searchGames(query);
    setResults(games);
    setLoading(false);
  };

  // JAGAME KOGU KAHEKS
  const wishlistGames = myLibrary.filter(game => game.status === 'wishlist' || !game.status);
  const playedGames = myLibrary.filter(game => game.status === 'played');

  const GameCard = ({ game, isPlayed }) => (
    <div className="relative group">
      <Link href={`/game/${game.id}`} className="block">
        <div className={`relative aspect-[2/3] rounded-3xl overflow-hidden border transition-all duration-700 transform group-hover:-translate-y-3 shadow-2xl ${
          isPlayed ? 'border-green-500/20 group-hover:border-green-500/60' : 'border-orange-500/20 group-hover:border-orange-500/60'
        }`}>
          <img 
            src={game.image} 
            className={`w-full h-full object-cover transition-all duration-1000 ${isPlayed ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} 
            alt={game.name} 
          />
          {game.rating > 0 && (
            <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-xl">
              <Star size={12} fill="#f97316" className="text-orange-500" />
              <span className="text-xs font-black tracking-tighter">{game.rating}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
      <button 
        onClick={() => removeFromLibrary(game.id)} 
        className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-2xl border-[6px] border-[#050505] hover:scale-110 active:scale-90"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <p className="mt-5 text-[10px] font-black uppercase truncate text-gray-500 group-hover:text-white px-2 tracking-[0.15em] transition-colors">{game.name}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans tracking-tight pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* --- LOGO SECTION: MASSIIVNE JA KESKEL --- */}
        <div className="flex flex-col items-center justify-center pt-24 pb-20 relative">
          {/* Pulseeriv aura logo taga */}
          <div className="absolute w-80 h-80 bg-orange-600/10 blur-[120px] rounded-full -z-10 animate-pulse transition-all duration-1000"></div>
          
          <Link href="/" className="hover:scale-[1.03] active:scale-95 transition-all duration-500 block mb-10 group">
            <img 
              src="/logo.png" 
              alt="Kardboord Logo" 
              className="h-32 md:h-56 w-auto object-contain drop-shadow-[0_0_45px_rgba(234,88,12,0.45)] transition-all duration-500 group-hover:drop-shadow-[0_0_60px_rgba(234,88,12,0.6)]" 
            />
          </Link>
          
          <div className="flex items-center gap-6 opacity-40">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/20"></div>
            <p className="text-[11px] font-black uppercase tracking-[0.6em] text-orange-500 italic">
              Digital Board Game Vault
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/20"></div>
          </div>
        </div>

        {/* --- SEARCH SECTION --- */}
        <div className="max-w-2xl mx-auto mb-32 group">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-orange-900 rounded-[2rem] blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Leia järgmine mäng..." 
                className="bg-[#0c0c0c] p-7 pl-16 rounded-[2rem] w-full outline-none border border-white/5 focus:border-orange-500/40 transition-all text-xl shadow-2xl placeholder:text-gray-700 font-medium"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-orange-500 transition-colors" size={24} />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-600/30 active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Otsi"}
              </button>
            </div>
          </form>
        </div>

        {/* --- 1. MÄNGUOOTEL --- */}
        {wishlistGames.length > 0 && (
          <section className="mb-32">
            <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-6">
              <div className="p-3 bg-orange-600/10 rounded-2xl border border-orange-500/20">
                <Clock className="text-orange-500" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Mänguootel</h2>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Sinu järgmised seiklused</p>
              </div>
              <span className="ml-auto text-[10px] font-black text-white/20 bg-white/5 px-4 py-2 rounded-full uppercase tracking-tighter">{wishlistGames.length} MÄNGU</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-10">
              {wishlistGames.map(game => <GameCard key={game.id} game={game} isPlayed={false} />)}
            </div>
          </section>
        )}

        {/* --- 2. MÄNGITUD --- */}
        {playedGames.length > 0 && (
          <section className="mb-32">
            <div className="flex items-center gap-5 mb-12 border-b border-white/5 pb-6">
              <div className="p-3 bg-green-600/10 rounded-2xl border border-green-500/20">
                <CheckCircle2 className="text-green-500" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-green-500 leading-none">Mängitud</h2>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Läbitud väljakutsed</p>
              </div>
              <span className="ml-auto text-[10px] font-black text-white/20 bg-white/5 px-4 py-2 rounded-full uppercase tracking-tighter">{playedGames.length} MÄNGU</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-10">
              {playedGames.map(game => <GameCard key={game.id} game={game} isPlayed={true} />)}
            </div>
          </section>
        )}

        {/* --- OTSINGUTULEMUSED --- */}
        {results.length > 0 && (
          <div className="pt-16 border-t border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-3 mb-12">
              <LayoutGrid size={18} className="text-gray-600" />
              <h2 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">Leitud tulemused</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {results.map((game) => (
                <Link href={`/game/${game.id}`} key={game.id} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-3xl border border-white/5 group-hover:border-orange-500/50 transition-all duration-700 bg-[#0c0c0c] shadow-2xl transform group-hover:scale-[1.03]">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
                       <p className="text-[9px] text-orange-500 font-black uppercase tracking-widest mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">{game.year}</p>
                       <h3 className="font-black text-sm uppercase italic leading-tight group-hover:text-white transition-colors">{game.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TÜHI OLEK */}
        {results.length === 0 && myLibrary.length === 0 && !loading && (
          <div className="text-center py-48 opacity-20">
            <LayoutGrid size={48} strokeWidth={1} className="mx-auto mb-6" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Vault is empty</p>
          </div>
        )}
      </div>
    </main>
  );
}