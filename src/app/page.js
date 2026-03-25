"use client";
import { useState, useEffect } from 'react';
import { searchGames } from '@/lib/bgg';
import Link from 'next/link';
import { Search, Star, Loader2, Clock, CheckCircle2, LayoutGrid, Sparkles } from 'lucide-react';

// Need on püsivad soovitused, mis on alati ekraanil
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

  // Nüüd useEffect ainult laeb olemasoleva raamatukogu, 
  // ta ei lisa sinna ise enam midagi juurde.
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

  const wishlistGames = myLibrary.filter(game => game.status === 'wishlist' || !game.status);
  const playedGames = myLibrary.filter(game => game.status === 'played');

  const GameCard = ({ game, isPlayed }) => (
    <div className="relative group">
      <Link href={`/game/${game.id}`} className="block">
        <div className={`relative aspect-[2/3] rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500 transform md:group-hover:-translate-y-3 shadow-xl ${
          isPlayed ? 'border-green-500/20 md:group-hover:border-green-500/60' : 'border-orange-500/20 md:group-hover:border-orange-500/60'
        }`}>
          <img 
            src={game.image} 
            className={`w-full h-full object-cover transition-all duration-700 ${isPlayed ? 'opacity-100' : 'opacity-60 md:group-hover:opacity-100'}`} 
            alt={game.name} 
          />
          {game.rating > 0 && (
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/90 backdrop-blur-xl px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl flex items-center gap-1 border border-white/10 shadow-xl">
              <Star size={10} fill="#f97316" className="text-orange-500 md:w-3 md:h-3" />
              <span className="text-[10px] md:text-xs font-black tracking-tighter">{game.rating}</span>
            </div>
          )}
        </div>
      </Link>
      <button 
        onClick={() => removeFromLibrary(game.id)} 
        className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-red-600 text-white rounded-full p-1.5 md:p-2.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20 shadow-2xl border-2 md:border-[6px] border-[#050505]"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <p className="mt-3 md:mt-5 text-[9px] md:text-[10px] font-black uppercase truncate text-gray-500 px-1 tracking-widest">{game.name}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-12 tracking-tight pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* --- LOGO --- */}
        <div className="flex flex-col items-center justify-center pt-10 pb-12 md:pt-24 md:pb-20 relative">
          <Link href="/" className="transition-all duration-500 block mb-6 md:mb-10">
            <img src="/logo.png" alt="Kardboord Logo" className="h-20 md:h-56 w-auto object-contain" />
          </Link>
          <p className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] text-orange-500 italic">Digital Vault</p>
        </div>

        {/* --- SEARCH --- */}
        <div className="max-w-3xl mx-auto mb-32">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Leia mäng..." 
              className="bg-transparent border-b-2 border-white/10 py-6 md:py-10 w-full outline-none focus:border-orange-600 transition-all text-2xl md:text-5xl font-semibold tracking-tighter placeholder:text-white/10"
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-orange-600 transition-colors">
              {loading ? <Loader2 className="animate-spin" size={32} /> : <Search size={32} />}
            </button>
          </form>
        </div>

        {/* --- UUS: KARDBOORDI SOOVITUSED --- */}
        <section className="mb-24 md:mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-l-4 border-orange-600 pl-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Kardboord<br/><span className="text-orange-600">Picks</span>
              </h2>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 mt-4 md:mt-0">
              Toimetaja valik / 2024
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {recommendedGames.map(game => (
              <Link href={`/game/${game.id}`} key={game.id} className="group bg-[#050505] overflow-hidden relative aspect-[16/9] md:aspect-square">
                <img
                  src={game.image}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
                  alt={game.name}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-xs font-black uppercase tracking-widest text-white">{game.name}</p>
                  <div className="h-[2px] w-0 group-hover:w-full bg-orange-600 transition-all duration-500 mt-2"></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- SEKTSIOONID (Mänguootel ja Mängitud) --- */}
        {[
          { title: "Mänguootel", icon: <Clock size={20} />, data: wishlistGames, color: "orange" },
          { title: "Mängitud", icon: <CheckCircle2 size={20} />, data: playedGames, color: "green" }
        ].map((section) => section.data.length > 0 && (
          <section key={section.title} className="mb-16 md:mb-32">
            <div className={`flex items-center gap-3 mb-8 border-b border-white/5 pb-4`}>
              <div className={`text-${section.color}-500`}>{section.icon}</div>
              <h2 className={`text-xl md:text-3xl font-black uppercase italic tracking-tighter ${section.color === 'green' ? 'text-green-500' : ''}`}>{section.title}</h2>
              <span className="ml-auto text-[8px] md:text-[10px] font-black text-white/20 bg-white/5 px-3 py-1.5 rounded-full">{section.data.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-10">
              {section.data.map(game => <GameCard key={game.id} game={game} isPlayed={section.color === 'green'} />)}
            </div>
          </section>
        ))}

        {/* --- OTSINGUTULEMUSED --- */}
        {results.length > 0 && (
          <div className="pt-10 border-t border-white/5">
            <h2 className="text-[9px] md:text-[11px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8">Tulemused</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-10">
              {results.map((game) => (
                <Link href={`/game/${game.id}`} key={game.id} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl md:rounded-3xl border border-white/5 bg-[#0c0c0c]">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-50 md:group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-3 md:p-6">
                       <h3 className="font-black text-[10px] md:text-sm uppercase italic leading-tight">{game.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}