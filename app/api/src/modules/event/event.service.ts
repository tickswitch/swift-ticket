import axios from "axios";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";

const TM_BASE = "https://app.ticketmaster.com/discovery/v2";
const apikey = () => process.env.TICKETMASTER_API_KEY as string;

// Safe Ticketmaster GET — returns null instead of throwing on API errors
const tmGet = async (url: string, params: Record<string, unknown>) => {
  try {
    const { data } = await axios.get(url, { params });
    return data;
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.fault?.faultstring || err?.message || "Ticketmaster error";
    console.error(`[TM] ${status || "network"} error — ${msg}`);
    return null;
  }
};

// Helper: compute resale ticket availability for an event
const getResaleAvailability = async (eventId: string) => {
  const tickets = await prisma.resaleTicket.findMany({
    where: { event_id: eventId, status: "approved" },
  });
  const totalQty = tickets.reduce((s, t) => s + t.quantity, 0);
  const totalReserved = tickets.reduce((s, t) => s + t.reserved_quantity, 0);
  const totalSold = tickets.reduce((s, t) => s + t.sold_quantity, 0);
  return Math.max(0, totalQty - totalReserved - totalSold);
};

// Helper: map a raw Ticketmaster event object to our response shape
const mapEvent = async (
  event: Record<string, unknown>,
  includeResale = true,
) => {
  const venue =
    (
      (event._embedded as Record<string, unknown>)?.venues as Record<
        string,
        unknown
      >[]
    )?.[0] ?? {};
  const lat =
    (venue as { location?: { latitude?: string } }).location?.latitude ?? null;
  const long =
    (venue as { location?: { longitude?: string } }).location?.longitude ??
    null;
  const classifications =
    (event.classifications as Record<string, unknown>[]) ?? [];
  const dates = event.dates as Record<string, Record<string, string>>;

  const base: Record<string, unknown> = {
    id: event.id,
    title: event.name,
    image: (event.images as { url: string }[])?.[0]?.url ?? null,
    start_date: dates?.start?.localDate ?? null,
    date: dates?.start?.localDate ?? null,       // alias used by frontend components
    end_date: dates?.end?.localDate ?? dates?.start?.localDate ?? null,
    time: dates?.start?.localTime ?? null,
    venue: (venue as { name?: string }).name ?? null,
    location: (venue as { city?: { name?: string } }).city?.name ?? null,
    latitude: lat,
    longitude: long,
    mapUrl:
      lat && long
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
        : null,
    ticket_url: event.url ?? null,
    genres: classifications
      .map((c) => (c.genre as { name?: string })?.name)
      .filter(Boolean),
    segment: classifications
      .map((c) => (c.segment as { name?: string })?.name)
      .filter(Boolean),
  };

  if (includeResale) {
    base.available_quantity = await getResaleAvailability(event.id as string);
  }
  return base;
};

const filterEvents = async (
  params: Record<string, string | number | undefined>,
) => {
  const data = await tmGet(`${TM_BASE}/events.json`, { apikey: apikey(), ...params });
  const events: Record<string, unknown>[] = data?._embedded?.events ?? [];
  const pageInfo = data?.page ?? {};
  const mapped = await Promise.all(events.map((e) => mapEvent(e)));
  return { pagination: pageInfo, data: mapped };
};

const searchEvents = async (keyword: string | undefined, lat?: string, lng?: string) => {
  const hasLocation = lat && lng && lat !== "undefined" && lng !== "undefined";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    keyword,
    size: 50,
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius: 150, sort: "distance,asc" } : {}),
  });
  const events: Record<string, unknown>[] = data?._embedded?.events ?? [];
  return Promise.all(events.map((e) => mapEvent(e, false)));
};

const getEventDetails = async (eventId: string) => {
  const { data } = await axios.get(`${TM_BASE}/events/${eventId}.json`, {
    params: { apikey: apikey() },
  });

  const classifications: Record<string, unknown>[] = data.classifications ?? [];
  const categories: string[] = classifications.map(
    (c) => (c.segment as { name?: string })?.name ?? "General Admission",
  );
  if (!categories.length)
    categories.push(
      ...["General Admission", "Floor", "VIP", "Upper Level", "Lower Level"],
    );

  const venue = data._embedded?.venues?.[0] ?? {};
  const lat = venue.location?.latitude ?? null;
  const long = venue.location?.longitude ?? null;

  return {
    data: {
      id: data.id,
      title: data.name,
      start_date: data.dates?.start?.localDate ?? null,
      end_date:
        data.dates?.end?.localDate ?? data.dates?.start?.localDate ?? null,
      time: data.dates?.start?.localTime ?? null,
      venue: venue.name ?? null,
      location: venue.city?.name ?? null,
      latitude: lat,
      longitude: long,
      mapUrl: lat
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
        : null,
      image: data.images?.[0]?.url ?? null,
      ticket_url: data.url ?? null,
    },
    ticket_categories: [...new Set(categories)],
    seatmap: data.seatmap?.staticUrl ?? null,
  };
};

const dedupeByName = (events: Record<string, unknown>[]) => {
  const seen = new Set<string>();
  return events.filter((e) => {
    const name = (e.name as string)?.toLowerCase().trim();
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
};

const trendingNearby = async (lat: string, lng: string, radius: number) => {
  const hasLocation = lat && lng && lat !== "undefined" && lng !== "undefined";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius } : {}),
    size: 20,
    sort: "relevance,desc",
  });
  const events = dedupeByName(data?._embedded?.events ?? []);
  return Promise.all(events.map((e) => mapEvent(e, false)));
};

const sportsinArea = async (lat: string, lng: string, radius: number, page: number) => {
  const hasLocation = lat && lng && lat !== "undefined" && lng !== "undefined";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius } : {}),
    size: 20,
    page,
    classificationName: "Sports",
  });
  const events = dedupeByName(data?._embedded?.events ?? []);
  const mapped = await Promise.all(events.map((e) => mapEvent(e)));
  return { pagination: data?.page ?? {}, data: mapped };
};

const concertsinArea = async (lat: string, lng: string, radius: number, page: number) => {
  const hasLocation = lat && lng && lat !== "undefined" && lng !== "undefined";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius } : {}),
    size: 20,
    page,
    classificationName: "Music",
  });
  const events = dedupeByName(data?._embedded?.events ?? []);
  const mapped = await Promise.all(events.map((e) => mapEvent(e)));
  return { pagination: data?.page ?? {}, data: mapped };
};

const popularEvents = async (lat: string, lng: string, radius: number) => {
  const hasLocation = lat && lng && lat !== "0" && lng !== "0";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius } : {}),
    size: 6,
    sort: "relevance,desc",
  });
  const events = dedupeByName(data?._embedded?.events ?? []);
  return Promise.all(events.map((e) => mapEvent(e)));
};

const festivalsNearby = async (lat: string, lng: string, radius: number) => {
  const hasLocation = lat && lng && lat !== "undefined" && lng !== "undefined";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius } : {}),
    classificationName: "Music",
    keyword: "festival",
    size: 20,
    sort: "relevance,desc",
  });
  const events = dedupeByName(data?._embedded?.events ?? []);
  return Promise.all(events.map((e) => mapEvent(e, false)));
};

const similarEvents = async (eventId: string) => {
  const detailData = await tmGet(`${TM_BASE}/events/${eventId}.json`, { apikey: apikey() });
  const segment = detailData?.classifications?.[0]?.segment?.name;
  const data = await tmGet(`${TM_BASE}/events.json`, { apikey: apikey(), classificationName: segment, size: 10 });
  const events: Record<string, unknown>[] = (data?._embedded?.events ?? [])
    .filter((e: Record<string, unknown>) => e.id !== eventId);
  return Promise.all(events.map((e) => mapEvent(e, false)));
};

const bestVenues = async (lat?: string, lng?: string) => {
  const hasLocation = lat && lng && lat !== "0" && lng !== "0";
  const data = await tmGet(`${TM_BASE}/venues.json`, {
    apikey: apikey(),
    size: 10,
    sort: "relevance,desc",
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius: 100 } : {}),
  });
  const venues: Record<string, unknown>[] = data?._embedded?.venues ?? [];
  return venues.map((v) => ({
    id: v.id,
    name: v.name,
    city: (v as { city?: { name?: string } }).city?.name ?? null,
    state: (v as { state?: { name?: string } }).state?.name ?? null,
    country: (v as { country?: { name?: string } }).country?.name ?? null,
    address: (v as { address?: { line1?: string } }).address?.line1 ?? null,
    url: v.url ?? null,
    latitude: (v as { location?: { latitude?: string } }).location?.latitude ?? null,
    longitude: (v as { location?: { longitude?: string } }).location?.longitude ?? null,
    postalCode: (v as { postalCode?: string }).postalCode ?? null,
    timezone: (v as { timezone?: string }).timezone ?? null,
  }));
};

const citiesSearch = async (keyword: string) => {
  if (!keyword.trim()) return [];

  let places: any[] = [];
  try {
    const { data } = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: keyword,
          format: "json",
          limit: 8,
          featuretype: "city",
          addressdetails: 1,
        },
        headers: { "User-Agent": "SwiftTickets/1.0 (noreply@swifttickets.in)" },
        timeout: 8000,
      }
    );
    places = Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error(`[Nominatim] error — ${err?.message}`);
    return [];
  }

  const uniqueCitiesMap = new Map();

  places.forEach((place: any) => {
    const cityName =
      place.address?.city ||
      place.address?.town ||
      place.address?.village ||
      place.address?.county ||
      place.display_name?.split(",")[0];
    const country = place.address?.country || "";
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    if (cityName && !uniqueCitiesMap.has(cityName)) {
      uniqueCitiesMap.set(cityName, { city: cityName, country, latitude: lat, longitude: lon });
    }
  });

  return Array.from(uniqueCitiesMap.values());
};
const eventsBygrouped = async (lat?: string, lng?: string) => {
  const hasLocation = lat && lng && lat !== "0" && lng !== "0";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    size: 100,
    classificationName: "Sports",
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius: 150 } : {}),
  });
  const events: Record<string, unknown>[] = data?._embedded?.events ?? [];
  const formatted = events.map((e) => {
    const classifications =
      (e.classifications as Record<string, unknown>[]) ?? [];
    const venue =
      ((e._embedded as Record<string, unknown[]>)?.venues?.[0] as Record<string, unknown>) ?? {};
    return {
      id: e.id,
      title: e.name,
      image: (e.images as { url: string }[])?.[0]?.url ?? null,
      location: (venue as { city?: { name?: string } }).city?.name ?? null,
      country: (venue as { country?: { name?: string } }).country?.name ?? null,
      latitude: (venue as { location?: { latitude?: string } }).location?.latitude ?? null,
      longitude: (venue as { location?: { longitude?: string } }).location?.longitude ?? null,
      genres: classifications
        .map((c) => (c.genre as { name?: string })?.name)
        .filter(Boolean),
      segment: classifications
        .map((c) => (c.segment as { name?: string })?.name)
        .filter(Boolean),
    };
  });

  const grouped: Record<string, unknown[]> = {};
  for (const ev of formatted) {
    if (!ev.genres.length) {
      (grouped["Other"] ??= []).push(ev);
    } else {
      for (const g of ev.genres as string[]) {
        (grouped[g] ??= []).push(ev);
      }
    }
  }
  return grouped;
};

const getEventsByGenre = async (genre: string, page: number, lat?: string, lng?: string) => {
  const hasLocation = lat && lng && lat !== "0" && lng !== "0";
  const data = await tmGet(`${TM_BASE}/events.json`, {
    apikey: apikey(),
    classificationName: genre,
    size: 50,
    page,
    ...(hasLocation ? { latlong: `${lat},${lng}`, radius: 150 } : {}),
  });
  const events: Record<string, unknown>[] = data?._embedded?.events ?? [];
  const mapped = await Promise.all(events.map((e) => mapEvent(e)));
  return { genre, data: mapped, pagination: data?.page ?? {} };
};

// Favorites
const favoCalendar = async (
  userId: number,
  eventId: string,
  status: "interest" | "going",
) => {
  const existing = await prisma.favorite.findFirst({
    where: { user_id: userId, event_id: eventId, status },
  });

  if (existing) {
    await prisma.favorite.deleteMany({
      where: { user_id: userId, event_id: eventId },
    });
    return {
      message: `${status.charAt(0).toUpperCase() + status.slice(1)} removed`,
      status: "removed",
    };
  }

  await prisma.favorite.deleteMany({
    where: { user_id: userId, event_id: eventId },
  });
  await prisma.favorite.create({
    data: { user_id: userId, event_id: eventId, status },
  });
  return {
    message: `${status.charAt(0).toUpperCase() + status.slice(1)} added`,
    status: "added",
  };
};

const myFavorites = async (userId: number) => {
  const favorites = await prisma.favorite.findMany({
    where: { user_id: userId },
  });
  if (!favorites.length) return [];

  const eventIds = favorites.map((f) => f.event_id);
  const { data } = await axios.get(`${TM_BASE}/events.json`, {
    params: { apikey: apikey(), id: eventIds.join(",") },
  });
  const events: Record<string, unknown>[] = data._embedded?.events ?? [];

  return events.map((e) => {
    const fav = favorites.find((f) => f.event_id === e.id);
    const venue =
      ((e._embedded as Record<string, unknown[]>)?.venues?.[0] as Record<
        string,
        unknown
      >) ?? {};
    const dates = e.dates as Record<string, Record<string, string>>;
    return {
      id: e.id,
      title: e.name,
      venue: (venue as { name?: string }).name ?? null,
      location: (venue as { city?: { name?: string } }).city?.name ?? null,
      start_date: dates?.start?.localDate ?? null,
      end_date: dates?.end?.localDate ?? dates?.start?.localDate ?? null,
      time: dates?.start?.localTime ?? null,
      category:
        (
          (e.classifications as Record<string, unknown>[])?.[0]?.segment as {
            name?: string;
          }
        )?.name ?? null,
      status: fav?.status,
      image: (e.images as { url: string }[])?.[0]?.url ?? null,
    };
  });
};

const toggleNotification = async (
  userId: number,
  eventId: string,
  notify: boolean,
) => {
  await prisma.eventNotification.upsert({
    where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    create: { user_id: userId, event_id: eventId, notify },
    update: { notify },
  });

  if (notify) {
    await prisma.favorite.upsert({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
      create: { user_id: userId, event_id: eventId, status: "interest" },
      update: { status: "interest" },
    });
  }

  return {
    message: notify
      ? "Notifications turned ON for this event"
      : "Notifications turned OFF for this event",
    status: notify ? "on" : "off",
  };
};

const ticketAlert = async (userId: number) => {
  const alerts = await prisma.eventNotification.findMany({
    where: { user_id: userId, notify: true },
  });
  if (!alerts.length) return [];

  const eventIds = alerts.map((a) => a.event_id);
  const { data } = await axios.get(`${TM_BASE}/events.json`, {
    params: { apikey: apikey(), id: eventIds.join(",") },
  });
  const events: Record<string, unknown>[] = data._embedded?.events ?? [];

  return events.map((e) => {
    const alert = alerts.find((a) => a.event_id === e.id);
    const venue =
      ((e._embedded as Record<string, unknown[]>)?.venues?.[0] as Record<
        string,
        unknown
      >) ?? {};
    const dates = e.dates as Record<string, Record<string, string>>;
    return {
      id: e.id,
      title: e.name,
      venue: (venue as { name?: string }).name ?? null,
      location: (venue as { city?: { name?: string } }).city?.name ?? null,
      start_date: dates?.start?.localDate ?? null,
      end_date: dates?.end?.localDate ?? dates?.start?.localDate ?? null,
      time: dates?.start?.localTime ?? null,
      category:
        (
          (e.classifications as Record<string, unknown>[])?.[0]?.segment as {
            name?: string;
          }
        )?.name ?? null,
      notify: alert?.notify,
      image: (e.images as { url: string }[])?.[0]?.url ?? null,
    };
  });
};

export const eventService = {
  filterEvents,
  searchEvents,
  getEventDetails,
  trendingNearby,
  festivalsNearby,
  sportsinArea,
  concertsinArea,
  popularEvents,
  similarEvents,
  bestVenues,
  citiesSearch,
  eventsBygrouped,
  getEventsByGenre,
  favoCalendar,
  myFavorites,
  toggleNotification,
  ticketAlert,
};
