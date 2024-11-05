import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // Change here
import routes from './routes/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sampahRoutes from './routes/sampahRoutes.js';
import penjemputanRoutes from './routes/penjemputanRoutes.js';
import dropboxRoutes from './routes/dropboxRoutes.js';

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allowed domains
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    credentials: true // If you want to send cookies or other credentials
};

app.use(express.json());
app.use(cors(corsOptions));

// Use routes
app.use('/api', routes, sampahRoutes, penjemputanRoutes, dropboxRoutes, authRoutes, userRoutes);

export default app;
