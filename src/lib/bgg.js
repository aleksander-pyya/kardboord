export async function searchGames(query) {
  if (!query) return [];

  const demoData = [
    { 
      id: "13", 
      name: "Catan", 
      image: "/catan.jpg", // Viitab public/catan.jpg failile
      year: "1995" 
    },
    { 
      id: "233078", 
      name: "Wingspan", 
      image: "/wingspan.jpg", // Viitab public/wingspan.jpg failile
      year: "2019" 
    },
    { 
      id: "1406", 
      name: "Monopoly", 
      image: "/monopoly.jpg", // Viitab public/monopoly.jpg failile
      year: "1933" 
    },
    { 
      id: "174430", 
      name: "Gloomhaven", 
      image: "/catan.jpg", // Kasutame ajutiselt Catani pilti
      year: "2017" 
    }
  ];

  const filtered = demoData.filter(game => 
    game.name.toLowerCase().includes(query.toLowerCase())
  );

  await new Promise(resolve => setTimeout(resolve, 300));
  return filtered;
}