import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import ClassRoom from "../models/ClassRoom.js";
import Users from "../models/Users.js";

// CREATE A NEW CLASSROOM

export const createClassroom = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, studentEmail } = req.body;

    // 1. Verificar Rol: Solo los profesores pueden crear salas
    if (req.user?.role !== "teacher") {
      res
        .status(403)
        .json({ message: "Solo los profesores pueden crear salas" });
      return;
    }

    // 2. Buscar al alumno por su email
    const student = await Users.findOne({ email: studentEmail });

    if (!student) {
      res
        .status(404)
        .json({ message: "No se encontró un usuario con ese email" });
      return;
    }

    // 3. Crear la sala vinculando al Profe (req.user) y al Alumno encontrado
    const newClassRoom = await ClassRoom.create({
      name,
      TeacherId: req.user._id, // El ID viene del token del usuario logueado
      StudentId: student._id, // El ID lo sacamos de la búsqueda por email
      tasks: [], // Empieza vacía
    });

    res.status(201).json(newClassRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la sala" });
  }
};

// --- OBTENER MIS SALAS ---
// Esta función sirve tanto para profesores como alumnos.
// Devuelve las salas donde tú eres participante.
export const obtainMyClassRooms = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Usuario no identificado" });
      return;
    }
    // Buscamos salas donde soy profesor O soy alumno ($or)
    const classRooms = await ClassRoom.find({
      $or: [{ TeacherId: userId }, { StudentIdId: userId }],
    })
      .populate("TeacherId", "name email") // .populate rellena los datos del usuario en vez de solo mostrar el ID
      .populate("StudentId", "name email");

    res.json(classRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las salas" });
  }
};

// ... (imports anteriores)
// Asegúrate de importar también Request de express y Types de mongoose si hace falta
import { Types } from "mongoose";
import mongoose from "mongoose";

// --- AGREGAR TAREA (Solo Profesor) ---
export const addTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { classRoomId } = req.params; // Viene de la URL /api/salas/:salaId/tareas

  if (typeof classRoomId !== 'string') {
        res.status(400).json({ message: "Los IDs de sala y tarea son obligatorios y deben ser texto" });
        return;
    }

    
   if (!mongoose.Types.ObjectId.isValid(classRoomId)) {
  res.status(400).json({ message: "El ID de la sala no es válido" });
  return;
}

  const { type, content, correction } = req.body;

    if (!classRoomId) {
      res.status(404).json({ message: "Sala no encontrada" });
      return;
    }
  try {
    const room = await ClassRoom.findById(classRoomId);

    if (!room) {
      res.status(404).json({ message: "Sala no encontrada" });
      return; 
    }

    // Seguridad: ¿Es el usuario actual el dueño de la sala?
    if (room.TeacherId.toString() !== req.user?._id.toString()) {
      res
        .status(403)
        .json({ message: "No tienes permiso para editar esta sala" });
      return;
    }

    // Creamos el objeto tarea
    const newTask = {
      type,
      content,
      correction,
      completed: false, // Siempre empieza en false
    };

    // PUSH: Empujamos la tarea al array
    // @ts-ignore (A veces TS se queja con los subdocumentos, esto lo soluciona rápido)
    room.tasks.push(newTask);

    // Guardamos la sala completa (esto actualiza la DB)
    await room.save();

    res.status(201).json(ClassRoom); // Devolvemos la sala actualizada
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar tarea" });
  }
};

// --- MARCAR TAREA COMO COMPLETADA (Alumno o Profesor) ---
export const toggleTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { roomId, taskId } = req.params;

  try {
    const classRoom = await ClassRoom.findById(roomId);

    if (!classRoom) {
      res.status(404).json({ message: "Sala no encontrada" });
      return;
    }

    // Seguridad: ¿El usuario pertenece a esta sala?
    const itsMyRoom =
      classRoom.TeacherId.toString() === req.user?._id.toString() ||
      classRoom.StudentId.toString() === req.user?._id.toString();

    if (!itsMyRoom) {
      res.status(403).json({ message: "No tienes acceso a esta sala" });
      return;
    }

    // Buscamos la tarea específica dentro del array
    // Mongoose nos da el método .id() para buscar en subdocumentos
    const task = classRoom.tasks.find((t: any) => t._id.toString() === taskId);

    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    // Invertimos el valor (si era false -> true, si era true -> false)
    task.completed = !task.completed;

    await classRoom.save();

    res.json(classRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};
