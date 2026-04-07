import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('query')?.toLowerCase();

  try {
    const filePath = path.join(process.cwd(), 'boardgames_ranks.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true, skipEmptyLines: true, dynamicTyping: true });
    let games = parsedData.data;

    // --- DETAILVAADE (See juba töötab sul) ---
    if (id) {
      const game = games.find(g => String(g.id) === String(id));
      if (game) {
        try {
          const imgApi = `https://api.geekdo.com/api/images?ajax=1&gallery=all&nosession=1&objectid=${id}&objecttype=thing&showcount=1&size=thumb`;
          const imgRes = await fetch(imgApi);
          const imgData = await imgRes.json();
          game.image = imgData.images?.[0]?.imageurl_lg || imgData.images?.[0]?.imageurl;
        } catch (e) {
          game.image = `https://cf.geekdo-images.com/itemrep/img/id${id}-150.jpg`;
        }
        return NextResponse.json(game);
      }
    }

    // --- OTSING (Uuendame seda osa!) ---
    if (query) {
      const filtered = games
        .filter(g => (g.name || "").toString().toLowerCase().includes(query))
        .slice(0, 15); // Võtame 15 parimat vastet, et laadimine oleks kiire

      // Käime need 15 mängu läbi ja küsime neile päris pildid BGG-st
      const resultsWithImages = await Promise.all(filtered.map(async (game) => {
        try {
          const imgApi = `https://api.geekdo.com/api/images?ajax=1&gallery=all&nosession=1&objectid=${game.id}&objecttype=thing&showcount=1&size=thumb`;
          const imgRes = await fetch(imgApi);
          const imgData = await imgRes.json();
          
          return {
            ...game,
            // Kasutame BGG pildi URL-i, mis tuli API-st
            image: imgData.images?.[0]?.imageurl_thumb || imgData.images?.[0]?.imageurl || null
          };
        } catch (e) {
          return { ...game, image: null };
        }
      }));
      
      return NextResponse.json(resultsWithImages);
    }

    return NextResponse.json(games.slice(0, 50));
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}