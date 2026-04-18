export const formatEventDate = (date: string) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";

    return d.toLocaleDateString("en-US", {
      weekday: "short", // Thu
      month: "short",   // Apr
      day: "numeric",   // 17
    });
  } catch {
    return "Invalid date";
  }
};
