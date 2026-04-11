/**
 * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calcula la distancia total de una ruta
 */
export const calculateTotalDistance = (route) => {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const p1 = route[i];
    const p2 = route[i + 1];
    total += calculateDistance(
      parseFloat(p1.latitud), parseFloat(p1.longitud),
      parseFloat(p2.latitud), parseFloat(p2.longitud)
    );
  }
  return total;
};

/**
 * Algoritmo del Vecino Más Cercano (Nearest Neighbor) para optimizar la ruta.
 * Comienza desde el primer punto de la lista original.
 */
export const optimizeRouteNearestNeighbor = (originalRoute) => {
  if (originalRoute.length <= 2) return originalRoute;

  const unvisited = [...originalRoute];
  const optimized = [];
  
  // Empezamos por el primer punto (asumiendo que es el punto de partida)
  let current = unvisited.shift();
  optimized.push({ ...current, orden_visita_opt: 1 });

  let orderCount = 2;
  while (unvisited.length > 0) {
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(
        parseFloat(current.latitud), parseFloat(current.longitud),
        parseFloat(unvisited[i].latitud), parseFloat(unvisited[i].longitud)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    current = unvisited.splice(closestIndex, 1)[0];
    optimized.push({ ...current, orden_visita_opt: orderCount++ });
  }

  return optimized;
};
