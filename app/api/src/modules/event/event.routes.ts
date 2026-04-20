import { Router } from "express";
import { eventController } from "./event.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

// Public routes
router.get("/events", eventController.filterEvents);
router.get("/search-events", eventController.search);
router.get("/events-seats/:eventId", eventController.getEventDetails);

router.get("/events/trending-nearby", eventController.trendingNearby);
router.get("/events/festivals", eventController.festivalsNearby);
router.get("/events/nearby-phq", eventController.nearbyPHQ);
router.get("/events/sports-in-area", eventController.sportsinArea);
router.get("/events/concerts", eventController.concertsinArea);
router.get("/events/popular", eventController.popularEvents);
router.get("/events/:event/similar", eventController.similarEvents);
router.get("/events/by-groupe", eventController.eventsBygrouped);
router.get("/events/by-genre/:genre", eventController.getEventsByGenre);

// Use router to group /cities and /venues
router.get("/cities/search", eventController.citiesSearch);
router.get("/venues/best", eventController.bestVenues);

// Authenticated routes
router.get("/favorites-calendar", authenticate, eventController.myFavorites);
router.post(
  "/favo-calendar/add/:eventId",
  authenticate,
  eventController.favoCalendar,
);

router.post(
  "/events/notification/:eventId",
  authenticate,
  eventController.toggleNotification,
);
router.get("/ticket-alerts", authenticate, eventController.ticketAlert);

export default router;
