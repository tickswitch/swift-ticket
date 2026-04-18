export const getEmbedMapUrl = (mapUrl?: string): string => {
  if (!mapUrl) return "";
  const urlParams = new URLSearchParams(mapUrl.split("?")[1]);
  const query = urlParams.get("query");
  if (!query) return "";
  return `https://maps.google.com/maps?q=${query}&hl=en&z=14&output=embed`;
};
