"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Library, Trash2, Plus } from 'lucide-react';

export default function Home() {
  const [myLibrary, setMyLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Laeme mängud localStorage-st
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myLibrary') || '[]');
    setMyLibrary(saved);
  }, []);

  // Otsingu loogika
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Otsingu viga:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = (id) => {
    const updated = myLibrary.filter(game => String(game.id) !== String(id));
    setMyLibrary(updated);
    localStorage.setItem('myLibrary', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-sans italic">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
              Kard<span className="text-orange-600">boord</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.5em] font-bold text-white/30 pl-2">Digital Board Game Vault</p>
          </div>
          
          {/* SEARCH BOX */}
          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <input 
              type="text"
              placeholder="Search Global Database..."
              className="w-full bg-white/5 border-b-2 border-white/10 p-4 outline-none focus:border-orange-600 transition-all font-bold uppercase text-xs tracking-widest placeholder:text-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-4 text-white/20 group-hover:text-orange-600">
              <Search size={20} />
            </button>
          </form>
        </header>

        {/* SEARCH RESULTS SECTION */}
        {searchResults.length > 0 && (
          <section className="mb-32">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 mb-8 flex items-center gap-4">
              <Plus size={14} /> Search Results
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`} className="group relative aspect-[3/4] bg-white/5 overflow-hidden border border-white/5">
                  <img src={game.image || game.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={game.name} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="font-black uppercase text-[10px] leading-tight">{game.name}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button onClick={() => setSearchResults([])} className="mt-6 text-[10px] uppercase font-bold text-white/20 hover:text-white underline">Clear Results</button>
          </section>
        )}

        {/* MY VAULT SECTION */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-4">
            <Library size={14} /> Your Personal Vault
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {myLibrary.length === 0 ? (
              <div className="col-span-full py-20 border-2 border-dashed border-white/5 text-center">
                <p className="text-white/10 uppercase font-black tracking-widest italic">The Vault is empty. Start your collection.</p>
              </div>
            ) : (
              myLibrary.map((game) => (
                <div key={game.id} className="group flex bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <Link href={`/game/${game.id}`} className="w-24 h-32 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                    <img src={game.image} className="w-full h-full object-cover" alt={game.name} />
                  </Link>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-black uppercase text-sm leading-none mb-1 group-hover:text-orange-600 transition-colors">{game.name}</h3>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{game.year}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] px-2 py-1 font-black uppercase tracking-widest ${game.status === 'played' ? 'bg-green-600' : 'bg-orange-600'}`}>
                        {game.status || 'To Play'}
                      </span>
                      <button onClick={() => removeFromLibrary(game.id)} className="text-white/10 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-20 opacity-50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] italic mb-2">Gather. Play. Track.</p>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">© 2026 Aleksander Püüa.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}