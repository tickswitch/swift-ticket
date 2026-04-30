/**
 * Bootstrap module — must be the first import in server.ts.
 * Loads .env into process.env so all subsequent module imports
 * (including mail.ts) see the correct values.
 */
import dotenv from 'dotenv';
dotenv.config();
