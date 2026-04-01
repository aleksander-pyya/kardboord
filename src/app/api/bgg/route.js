import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ 
  ignoreAttributes: false, 
  attributeNamePrefix: "" 
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) return NextResponse.json([]);

  try {
    // 1. Otsime mänge nime järgi
    const searchRes = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`, {
      next: { revalidate: 3600 } // Cache'ime vastust 1 tund
    });
    const searchText = await searchRes.text();
    const searchJson = parser.parse(searchText);
    
    let items = searchJson.items?.item;
    if (!items) return NextResponse.json([]);

    const itemsArray = Array.isArray(items) ? items : [items];
    const limitedItems = itemsArray.slice(0, 10); // Võtame max 10 vastet
    
    // 2. Kuna otsing ei anna pilte, peame küsima detailid ID-de järgi
    const ids = limitedItems.map(i => i.id).join(',');
    const detailRes = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${ids}`);
    const detailText = await detailRes.text();
    const detailJson = parser.parse(detailText);
    
    let details = detailJson.items?.item;
    if (!details) return NextResponse.json([]);
    const detailsArray = Array.isArray(details) ? details : [details];

    const formatted = detailsArray.map(game => {
      // BGG nimi võib olla massiiv (primary ja alternate)
      const name = Array.isArray(game.name) 
        ? game.name.find(n => n.type === 'primary')?.value 
        : game.name.value;

      return {
        id: game.id,
        name: name || "Unknown Title",
        image: game.image || game.thumbnail || "https://placehold.co/400x600?text=No+Image",
        year: game.yearpublished?.value || "N/A",
        desc: game.description ? game.description.substring(0, 150) + "..." : ""
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("BGG API Error:", err);
    return NextResponse.json([]);
  }
}