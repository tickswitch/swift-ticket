export function filterParkingEvents<T extends { title?: string }>(events: T[]): T[] {
  return events.filter((e) => !/parking/i.test(e.title ?? ""));
}
