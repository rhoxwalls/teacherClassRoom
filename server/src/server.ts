import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// IMPORT ROUTES
import authRoutes from "./routes/authRoutes.js"
import classRoomRoutes from "./routes/classRoomRoutes.js"

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "";

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 peticiones por IP cada 15 mins
  message:
    "Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.",
});
app.use(limiter);

app.use(express.json());



const connectDB = async ()=>{
  try{
    if(!MONGODB_URI){
      throw new Error("MONGODB_URI no está definida en el archivo .env");
    };
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente a MongoDB Atlas');
  }catch(error){
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// --- RUTAS (Endpoints) ---
app.use('/api/auth', authRoutes);
app.use('/api/classrooms',classRoomRoutes);


// Ruta de prueba para ver si el servidor respira
app.get('/', (req: Request, res: Response) => {
  res.send('API de English Platform funcionando 🚀');
});

// AQUÍ importarás tus rutas futuras, por ejemplo:
// app.use('/api/users', userRoutes);
// app.use('/api/salas', salaRoutes);


// --- INICIO DEL SERVIDOR ---

// Primero conectamos la DB, luego levantamos el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`📡 Servidor escuchando en el puerto ${PORT}`);
    console.log(`🛡️  Modo: ${process.env.NODE_ENV || 'development'}`);
  });
});