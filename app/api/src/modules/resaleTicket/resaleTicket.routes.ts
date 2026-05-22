import { Router } from 'express';
import { resaleTicketController } from './resaleTicket.controller';
import { authenticate } from '../../middleware/auth';
import { ticketUpload } from '../../utils/fileUpload';

const router = Router();

// Public routes for event's resale tickets
router.get('/events/tickets/:eventId', resaleTicketController.eventTickets);
router.get('/events/:eventId/tickets/:ticketType', resaleTicketController.ticketsByType);

// Authenticated routes
router.post('/resale-tickets/custom-event', authenticate, resaleTicketController.submitCustomEvent);
router.post('/tickets/upload', authenticate, ticketUpload.array('ticket_file'), resaleTicketController.store);
router.get('/tickets/list/sell', authenticate, resaleTicketController.sellTicketList);
router.get('/tickets/list/buy', authenticate, resaleTicketController.buyTicketList);

export default router;
