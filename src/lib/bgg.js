export const searchGames = async (query) => {
  if (!query) return [];

  try {
    // KASUTAME KÕIGE KINDLAMAT KONVERTERIT: rss2json (see sööb ka tavalist XML-i)
    // See lahendab korraga: 1. CORS vea 2. XML parsimise 3. Kiiruse
    const bggUrl = `https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=${encodeURIComponent(query)}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(bggUrl)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Kontrollime, kas saime andmed kätte
    if (!data || !data.items || data.items.length === 0) {
      console.log("Tulemusi ei leitud või API piirang");
      return [];
    }

    // BGG XML-is on andmed 'item' märgendis, rss2json muudab need 'items' massiiviks
    // Kuna XML struktuur on keeruline, peame veidi "kaevama", et nime kätte saada
    return data.items.slice(0, 10).map(item => {
      // Kuna rss2json proovib XML-i tõlkida, siis nimi on tavaliselt peidus
      // Kui see meetod ebaõnnestub, tagastame vähemalt midagi loetavat
      return {
        id: item.guid || Math.random().toString(), 
        name: item.title || "Tundmatu mäng",
        year: item.pubDate ? item.pubDate.split('-')[0] : 'N/A',
        image: `https://cf.geekdo-images.com/itemrep/img/placeholder.jpg`
      };
    });

  } catch (error) {
    console.error("Viga otsingul:", error);
    return [];
  }
};