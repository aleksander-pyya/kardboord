"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Library, Trash2 } from 'lucide-react';

export default function Home() {
  const [myLibrary, setMyLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    setMyLibrary(saved);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }

    const res = await fetch(`/api/search?query=${encodeURIComponent(val)}`);
    const data = await res.json();
    setSearchResults(data);
  };

  const removeFromLibrary = (id) => {
    const updated = myLibrary.filter(g => String(g.id) !== String(id));
    setMyLibrary(updated);
    localStorage.setItem('myLibrary', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans italic selection:bg-orange-600">
      <div className="max-w-[1400px] mx-auto p-6 md:p-20">
        
        {/* LOGO JA OTSING */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-32">
          <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-[0.75]">
            KARD<br/><span className="text-orange-600">BOORD</span>
          </h1>
          
          <div className="w-full md:w-1/3 relative">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Search Database</p>
            <input 
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="TYPE TO FIND..."
              className="w-full bg-transparent border-b-4 border-white/10 p-4 outline-none focus:border-orange-600 transition-all font-black uppercase text-xl placeholder:text-white/5"
            />
          </div>
        </div>

        {/* OTSINGU TULEMUSED */}
        {searchResults.length > 0 && (
          <section className="mb-40 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {searchResults.map(game => (
                <Link key={game.id} href={`/game/${game.id}`} className="group relative aspect-[3/4] bg-white/5 border border-white/5 overflow-hidden">
                  <img src={game.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={game.name} />
                  <div className="absolute inset-0 bg-orange-600/90 opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-end">
                    <p className="font-black uppercase text-xs leading-none text-black italic">View Details</p>
                    <p className="font-black uppercase text-xl leading-tight text-black">{game.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* MINU VAULT */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <Library size={24} className="text-orange-600" />
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Your Personal Vault</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {myLibrary.map(game => (
              <div key={game.id} className="group flex bg-white/5 border border-white/5 hover:border-orange-600/50 transition-all">
                <Link href={`/game/${game.id}`} className="w-32 h-40 flex-shrink-0 grayscale group-hover:grayscale-0">
                  <img src={game.image} className="w-full h-full object-cover" alt={game.name} />
                </Link>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic leading-none mb-2">{game.name}</h3>
                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">{game.year} • RANK #{game.rank}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-3 py-1 italic">
                      {game.status || 'BACKLOG'}
                    </span>
                    <button onClick={() => removeFromLibrary(game.id)} className="text-white/10 hover:text-red-600 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}