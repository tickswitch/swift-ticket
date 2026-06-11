// Must be first: loads .env before any other module reads process.env
import "./config/env";

import express, { Express } from "express";
import cors from "cors";
import path from "path";

// Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import eventRoutes from './modules/event/event.routes';
import cartRoutes from './modules/cart/cart.routes';
import checkoutRoutes from './modules/checkout/checkout.routes';
import resaleTicketRoutes from './modules/resaleTicket/resaleTicket.routes';
import publicRoutes from './modules/public/public.routes';
import adminRoutes from './modules/admin/admin.routes';

// Middleware
import globalErrorHandler from "./middleware/errorHandler";

const app: Express = express();

// Trust the first proxy hop (Render/Heroku/etc.) so req.ip and rate-limit keys reflect the real client
app.set("trust proxy", 1);

// Middlewares
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://15.206.120.207"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (Uploaded Images, PDFs via Multer)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use('/api', authRoutes); // /api/register, /api/login, etc.
app.use('/api', userRoutes); // /api/profile, etc.
app.use('/api', eventRoutes); // /api/favorites-calendar, etc.
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api', resaleTicketRoutes); // /api/tickets/upload, etc.
app.use('/api', publicRoutes); // /api/cms, /api/contact-us, /api/faq, etc.
app.use('/api/admin', adminRoutes);
// Note: Some laravel routes lacked specific prefixes so they sit on /api. 
// E.g., /api/sports-in-area was defined directly in api.php. Our eventRoutes are bound to /api, which covers this.

// Handle unhandled routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: false,
    code: 404,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
