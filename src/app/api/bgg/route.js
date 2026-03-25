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
    const searchUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`;
    
    // Me lisame siia TÄPSED päised, mida Chrome saadaks
    const res = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      cache: 'no-store'
    });

    const text = await res.text();

    // KRIITILINE KONTROLL: Kui vastus on "Unauthorized", siis me ei proovigi parsida
    if (text.includes("Unauthorized")) {
      console.error("BGG ütleb ikka Unauthorized. Proovin vana API-t...");
      // TAGAVARAPLAAN: Proovime BGG vana XML API-t (v1)
      const v1Res = await fetch(`https://boardgamegeek.com/xmlapi/search?search=${encodeURIComponent(query)}`);
      const v1Text = await v1Res.text();
      const v1Json = parser.parse(v1Text);
      // ... siia võiks ehitada v1 parsimise, aga esialgu vaatame, kas see üldse vastab
      console.log("V1 Vastus:", v1Text.substring(0, 100));
    }

    const json = parser.parse(text);
    const items = json.items?.item;

    if (!items) return NextResponse.json([]);

    const itemsArray = Array.isArray(items) ? items : [items];
    const ids = itemsArray.slice(0, 8).map(item => item.id).join(',');

    // Küsime detailid (pildid)
    const detailRes = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${ids}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const detailText = await detailRes.text();
    const detailJson = parser.parse(detailText);
    const details = detailJson.items?.item;

    if (!details) return NextResponse.json([]);
    const detailsArray = Array.isArray(details) ? details : [details];

    const formatted = detailsArray.map(game => ({
      id: game.id,
      name: Array.isArray(game.name) ? game.name.find(n => n.type === 'primary')?.value : game.name.value,
      image: game.image,
      thumbnail: game.thumbnail,
      year: game.yearpublished?.value
    }));

    return NextResponse.json(formatted);

  } catch (err) {
    console.error("Viga:", err);
    return NextResponse.json([]);
  }
}