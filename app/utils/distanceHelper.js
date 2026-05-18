const getDistance = (coord1, coord2) => {
  const { lat: lat1, lng: lng1 } = coord1
  const { lat: lat2, lng: lng2 } = coord2

  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const filterByRadius = (items, center, radius) => {
  return items.reduce((result, item) => {
    if (item.coordinate) {
      const dist = getDistance(center, item.coordinate)
      if (dist <= radius) result.push({ ...item, distance: dist })
      return result.sort((a, b) => a.distance - b.distance)
    }

    let coordinate = null
    if (item.coordinate_secondary && item.coordinate_secondary.lat) coordinate = item.coordinate_secondary
    else if (item.coordinate_primary && item.coordinate_primary.lat) coordinate = item.coordinate_primary

    if (coordinate) {
      const dist = getDistance(center, coordinate)
      if (dist <= radius) result.push({ ...item, coordinate, distance: dist })
    }

    return result.sort((a, b) => a.distance - b.distance)
  }, [])
}

export const getNearest = (items, target, limit = 5) => {
  if (!items || !target || items.length === 0) return [];

  const itemsWithDistance = items.map(item => {
    if (!item.coordinate) return null;

    const distance = getDistance(target, item.coordinate);
    return {
      ...item,
      rawDistance: distance,
      distance: (Math.round(distance) / 1000).toFixed(2)
    };
  }).filter(Boolean);

  itemsWithDistance.sort((a, b) => a.rawDistance - b.rawDistance);

  return itemsWithDistance.slice(0, limit);
};
