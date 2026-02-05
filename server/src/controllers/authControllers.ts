import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users, { type IUser } from "../models/Users.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "temporal_secret", {
    expiresIn: "30d",
  });
};

// User Register
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "Por favor complete los campos" });
      return;
    }

    const userExist = await Users.findOne({ email });
    if (userExist) {
      res.status(400).json({ message: "Un usuario ya existe con ese email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || "student",
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    res.status(500).json({ response: "Error en el servidor al registrarse" });
  }
};

// USER LOGIN

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res
        .status(401)
        .json({
          message: "Credenciales inválidas (email o contraseña incorrectos)",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al loguear" }); 
  };
};
