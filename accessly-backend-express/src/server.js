import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import './services/passport.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import membershipRoutes from "./routes/membershipRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var corsOptions = {
  origin: "*",
};

dotenv.config();
const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/users', userRoutes);
app.use("/api/memberships", membershipRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));