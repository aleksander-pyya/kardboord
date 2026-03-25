import { parseStringPromise } from 'xml2js';

export const searchGames = async (query) => {
  try {
    // KASUTAME PROXY-T: See on vahendaja, mis lahendab CORS ja aegumise probleemid
    // See suunab päringu läbi serveri, mida BGG usaldab
    const proxy = "https://api.allorigins.win/get?url=";
    const bggUrl = encodeURIComponent(`https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=${query}`);

    const response = await fetch(`${proxy}${bggUrl}`);
    
    if (!response.ok) throw new Error('Võrgu viga');

    // AllOrigins pakub andmeid JSON-i sees, kus 'contents' on BGG XML
    const data = await response.json();
    const xml = data.contents;
    
    const result = await parseStringPromise(xml);

    if (!result.items || !result.items.item) return [];

    // Võtame esimesed 10 tulemust
    const games = await Promise.all(
      result.items.item.slice(0, 10).map(async (item) => {
        const id = item.$.id;
        
        // Et saada Pilti, peame tegema lisapäringu 'thing' API-sse
        // See on koht, kus BGG on "aegunud" - ta ei anna pilti otsinguga kaasa
        return {
          id: id,
          name: item.name[0].$.value,
          year: item.yearpublished ? item.yearpublished[0].$.value : 'N/A',
          image: `https://cf.geekdo-images.com/itemrep/img/placeholder.jpg` // Ajutine
        };
      })
    );

    return games;
  } catch (error) {
    console.error("BGG API viga:", error);
    return [];
  }
};