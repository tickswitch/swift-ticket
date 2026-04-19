import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { successResponse, errorResponse } from "../../utils/response";
import { eventService } from "./event.service";
import { AuthRequest } from "../../middleware/auth";
import { z } from "zod";

const filterEvents = catchAsync(async (req: Request, res: Response) => {
  const {
    period = "today",
    location,
    category,
    venue,
    from,
    to,
    query,
    filter,
    page = 0,
    size = 20,
    lat,
    lng,
    radius = 50,
    genre,
  } = req.query as Record<string, string>;

  const now = new Date();

  const periodMap: Record<string, { start: Date; end: Date }> = {
    today: { start: startOf(now, "day"), end: endOf(now, "day") },
    tomorrow: {
      start: startOf(addDays(now, 1), "day"),
      end: endOf(addDays(now, 1), "day"),
    },
    "this-week": { start: startOf(now, "week"), end: endOf(now, "week") },
    "next-week": {
      start: startOf(addDays(now, 7), "week"),
      end: endOf(addDays(now, 7), "week"),
    },
    "this-weekend": { start: nextWeekday(now, 5), end: nextWeekday(now, 0) },
    "this-month": { start: startOf(now, "month"), end: endOf(now, "month") },
  };

  let start: Date, end: Date;
  if (period === "custom") {
    if (!from || !to)
      return errorResponse(
        res,
        "From and To dates are required for custom period.",
        422,
      );
    start = new Date(from);
    end = new Date(to);
  } else if (periodMap[period]) {
    ({ start, end } = periodMap[period]);
  } else {
    return errorResponse(res, "Invalid period value.", 422);
  }

  const params: Record<string, string | number | undefined> = {
    startDateTime: start.toISOString().split(".")[0] + "Z",
    endDateTime: end.toISOString().split(".")[0] + "Z",
    size: Number(size),
    page: Number(page),
  };

  if (query) {
    if (filter === "city") params.city = query;
    else if (filter === "genre") params.classificationName = query;
    else params.keyword = query;
  }
  if (location && location.toLowerCase() !== "anywhere") params.city = location;
  if (lat && lng) {
    params.latlong = `${lat},${lng}`;
    params.radius = radius;
    params.unit = "miles";
  }
  if (venue) params.keyword = venue;
  if (category) params.keyword = category;
  if (genre) params.classificationName = genre;

  const result = await eventService.filterEvents(params);
  return res.json({ status: true, ...result });
});

const search = catchAsync(async (req: Request, res: Response) => {
  const data = await eventService.searchEvents(req.query.keyword as string);
  return res.json({ status: true, data });
});

const getEventDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getEventDetails(req.params.eventId);
  return res.json({ status: true, ...result });
});

const trendingNearby = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng, radius = "100" } = req.query as Record<string, string>;
  const data = await eventService.trendingNearby(lat ?? "", lng ?? "", Number(radius));
  return res.json({ status: true, data });
});

const festivalsNearby = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng, radius = "150" } = req.query as Record<string, string>;
  const data = await eventService.festivalsNearby(lat ?? "", lng ?? "", Number(radius));
  return res.json({ status: true, data });
});

const sportsinArea = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng, radius = "100", page = "0" } = req.query as Record<string, string>;
  const result = await eventService.sportsinArea(lat ?? "", lng ?? "", Number(radius), Number(page));
  return res.json({ status: true, ...result });
});

const concertsinArea = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng, radius = "100", page = "0" } = req.query as Record<string, string>;
  const result = await eventService.concertsinArea(lat ?? "", lng ?? "", Number(radius), Number(page));
  return res.json({ status: true, ...result });
});

const popularEvents = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng, radius = "100" } = req.query as Record<string, string>;
  const data = await eventService.popularEvents(lat ?? "", lng ?? "", Number(radius));
  return res.json({ status: true, data });
});

const similarEvents = catchAsync(async (req: Request, res: Response) => {
  const data = await eventService.similarEvents(req.params.event);
  return res.json({ status: true, data });
});

const bestVenues = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng } = req.query as Record<string, string>;
  const data = await eventService.bestVenues(lat, lng);
  return res.json({ status: true, data });
});

const citiesSearch = catchAsync(async (req: Request, res: Response) => {
  const data = await eventService.citiesSearch(
    ((req.query.query ?? req.query.keyword) as string) ?? "",
  );
  return res.json({ status: true, cities: data });
});

const eventsBygrouped = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng } = req.query as Record<string, string>;
  const data = await eventService.eventsBygrouped(lat, lng);
  return res.json({ status: true, data });
});

const getEventsByGenre = catchAsync(async (req: Request, res: Response) => {
  const { page = "0", lat, lng } = req.query as Record<string, string>;
  const result = await eventService.getEventsByGenre(req.params.genre, Number(page), lat, lng);
  return res.json({ status: true, ...result });
});

const favoCalendar = catchAsync(async (req: AuthRequest, res: Response) => {
  const parsed = z
    .object({ status: z.enum(["interest", "going"]) })
    .safeParse(req.body);
  if (!parsed.success)
    return errorResponse(res, parsed.error.errors[0].message, 422);
  const result = await eventService.favoCalendar(
    req.user!.id,
    req.params.eventId,
    parsed.data.status,
  );
  return res.json(result);
});

const myFavorites = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await eventService.myFavorites(req.user!.id);
  return res.json({ status: true, data });
});

const toggleNotification = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const parsed = z.object({ notify: z.boolean() }).safeParse(req.body);
    if (!parsed.success)
      return errorResponse(res, parsed.error.errors[0].message, 422);
    const result = await eventService.toggleNotification(
      req.user!.id,
      req.params.eventId,
      parsed.data.notify,
    );
    return res.json(result);
  },
);

const ticketAlert = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await eventService.ticketAlert(req.user!.id);
  return res.json({ status: true, data });
});

// ---- Date helpers ----
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function startOf(date: Date, unit: "day" | "week" | "month"): Date {
  const d = new Date(date);
  if (unit === "day") {
    d.setHours(0, 0, 0, 0);
  } else if (unit === "week") {
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
  } else if (unit === "month") {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  }
  return d;
}
function endOf(date: Date, unit: "day" | "week" | "month"): Date {
  const d = new Date(date);
  if (unit === "day") {
    d.setHours(23, 59, 59, 999);
  } else if (unit === "week") {
    d.setDate(d.getDate() - d.getDay() + 6);
    d.setHours(23, 59, 59, 999);
  } else if (unit === "month") {
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    d.setHours(23, 59, 59, 999);
  }
  return d;
}
function nextWeekday(date: Date, day: number): Date {
  const d = new Date(date);
  const diff = (day + 7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export const eventController = {
  filterEvents,
  search,
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
