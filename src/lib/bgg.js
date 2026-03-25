export const searchGames = async (query) => {
  try {
    // Kasutame populaarset bgg-json vahekihti, mis on kiirem ja annab JSON-it
    // See on avalik API, mis proxyb BGG andmeid modernsel kujul
    const response = await fetch(`https://bgg-json.azurewebsites.net/search?query=${query}`);
    
    if (!response.ok) throw new Error('Võrgu viga või API on maas');

    const data = await response.json();

    // See API tagastab massiivi mängudest. Filtreerime ja võtame esimesed 10.
    return data.slice(0, 10).map(item => ({
      id: item.gameId.toString(),
      name: item.name,
      year: item.yearPublished || 'N/A',
      // See API annab meile vahel kohe pildi lingi, kui mitte, kasutame ID-põhist ennustust
      image: item.thumbnail || `https://cf.geekdo-images.com/itemrep/img/placeholder.jpg`
    }));
  } catch (error) {
    console.error("BGG JSON API viga:", error);
    
    // TAGAVARA: Kui JSON API peaks alt vedama, siis tühja lehe asemel ei juhtu midagi hullu
    return [];
  }
};