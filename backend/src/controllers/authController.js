import {
  createSeller,
  loginSeller
} from "../services/authService.js";

export async function registerSeller(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "El usuario y la contraseña son obligatorios"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 8 caracteres"
      });
    }

    const seller = await createSeller(
      username.trim(),
      password
    );

    return res.status(201).json({
      message: "Vendedor creado correctamente",
      seller
    });
  } catch (error) {
    return res.status(409).json({
      message: error.message
    });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "El usuario y la contraseña son obligatorios"
      });
    }

    const result = await loginSeller(
      username.trim(),
      password
    );

    return res.json(result);
  } catch (error) {
    return res.status(401).json({
      message: error.message
    });
  }
}