import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  if (!query) return NextResponse.json([]);

  try {
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const text = await res.text();
    const json = parser.parse(text);
    const items = json.items?.item;

    if (!items) return NextResponse.json([]);
    const itemsArray = Array.isArray(items) ? items : [items];
    
    // Võtame esimesed 6 vastet
    const formatted = itemsArray.slice(0, 6).map(item => ({
      id: item.id,
      name: item.name.value,
      year: item.yearpublished?.value,
      image: `https://cf.geekdo-images.com/itemrep/img/P-p-p-p-p/pic${item.id}.jpg` // BGG piltide otsetee
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json([]);
  }
}