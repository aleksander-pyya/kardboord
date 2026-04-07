import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase();

  try {
    const filePath = path.join(process.cwd(), 'boardgame_ranks.csv');
    
    // KONTROLL 1: Kas fail on üldse olemas?
    if (!fs.existsSync(filePath)) {
      console.error("FAILI EI LEITUD asukohas:", filePath);
      return NextResponse.json({ error: "Fail puudub" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    // KONTROLL 2: Mis on tulba nimed? (Vaata seda oma terminalis!)
    console.log("CSV tulbad on:", Object.keys(parsedData.data[0]));

    if (!query) return NextResponse.json([]);

    const results = parsedData.data
      .filter(game => {
        // Kontrollime, mis nimega tulp su CSV-s on (vahel on 'name', vahel 'primary', vahel 'title')
        const name = (game.name || game.Name || game.title || "").toLowerCase();
        return name.includes(query);
      })
      .slice(0, 10)
      .map(game => ({
        id: game.id || game.ID || game.da_id,
        name: game.name || game.Name || game.title,
        year: game.yearpublished || "N/A",
        image: `https://cf.geekdo-images.com/itemrep/img/P-p-p-p-p/pic${game.id || game.ID}.jpg`,
        rank: game.rank || "0"
      }));

    return NextResponse.json(results);
  } catch (err) {
    console.error("Serveri viga:", err);
    return NextResponse.json([]);
  }
}