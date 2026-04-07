import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase();

  if (!query) return NextResponse.json([]);

  try {
    const filePath = path.join(process.cwd(), 'boardgame_ranks.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Filtreerime: otsime nime järgi VÕI täpse ID järgi (detailvaate jaoks)
    const results = parsedData.data
      .filter(game => {
        const name = (game.name || game.name || "").toLowerCase();
        const id = String(game.id || game.id || "");
        return name.includes(query) || id === query;
      })
      .slice(0, 15) // Piirame tulemusi, et brauseril oleks kerge
      .map(game => ({
        id: game.id,
        name: game.name || "Unknown",
        year: game.yearpublished || "N/A",
        // BGG piltide loogika ID põhjal
        image: `https://cf.geekdo-images.com/itemrep/img/P-p-p-p-p/pic${game.id}.jpg`,
        rank: game.rank || "Unranked",
        rating: game.average_rating || "0"
      }));

    return NextResponse.json(results);
  } catch (err) {
    console.error("CSV Error:", err);
    return NextResponse.json([]);
  }
}