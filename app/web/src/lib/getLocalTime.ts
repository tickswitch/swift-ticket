export const getLocalTime = (date: string, time: string) => {
  // Accepts HH:mm or HH:mm:ss (24hr), e.g. "19:30:00"
  const validTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  if (!time || !validTimeRegex.test(time)) {
    return "Invalid time";
  }
  try {
    // Add 'Z' to treat as UTC
    const isoString = `${date}T${time}Z`;
    const localDate = new Date(isoString);
    if (isNaN(localDate.getTime())) return "Invalid time";
    return localDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid time";
  }
};