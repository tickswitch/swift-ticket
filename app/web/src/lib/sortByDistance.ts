const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const sortByDistance = <T extends Record<string, any>>(
  items: T[],
  userLat: number | null | undefined,
  userLng: number | null | undefined,
): T[] => {
  if (!userLat || !userLng || !items?.length) return items ?? [];
  return [...items].sort((a, b) => {
    const dA =
      a.latitude && a.longitude
        ? haversineKm(userLat, userLng, Number(a.latitude), Number(a.longitude))
        : Infinity;
    const dB =
      b.latitude && b.longitude
        ? haversineKm(userLat, userLng, Number(b.latitude), Number(b.longitude))
        : Infinity;
    return dA - dB;
  });
};
