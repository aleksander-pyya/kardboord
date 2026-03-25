import { parseStringPromise } from 'xml2js';

export const searchGames = async (query) => {
  if (!query) return [];

  try {
    // 1. Kasutame AllOrigins proxy-t, et vältida CORS vigu brauseris
    const bggUrl = `https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=${encodeURIComponent(query)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(bggUrl)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Võrgu viga');

    const data = await response.json();
    const xml = data.contents; // AllOrigins paneb XML-i 'contents' väljale
    
    const result = await parseStringPromise(xml);

    // Kui tulemusi pole
    if (!result.items || !result.items.item) return [];

    // Võtame esimesed 10 tulemust
    const games = result.items.item.slice(0, 10).map(item => {
      const id = item.$.id;
      return {
        id: id,
        name: item.name[0].$.value,
        year: item.yearpublished ? item.yearpublished[0].$.value : 'N/A',
        // BGG otsing ei anna pilte, kasutame kavalat staatilist linki või placeholderit
        // NB! Enamikul populaarsetel mängudel töötab see BGG pildiserveri otseviide:
        image: `https://cf.geekdo-images.com/itemrep/img/placeholder.jpg` 
      };
    });

    return games;
  } catch (error) {
    console.error("BGG otsingu viga:", error);
    return [];
  }
};