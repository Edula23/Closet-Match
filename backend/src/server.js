import express from "express";
import dotenv from "dotenv";
import 'dotenv/config';
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import closetRoutes from "./routes/closetRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the file path
const __dirname = dirname(__filename);

app.use(express.json());
//Serves the html file from the /public directory
// app.use(express.static(path.join(__dirname, '../public')));
//tells express to serve all files from the public folder as static assets/files. Any requests for the css  files will be served from the public folder
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent
}));


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })
//Routes
app.use('/api/auth', authRoutes);
app.use('/api/closet', closetRoutes);
app.use('/api/outfits', outfitRoutes);

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`);
})