import jwt from "jsonwebtoken";

// Sign a JWT carrying the user id and role. Downstream middleware reads these
// to authenticate requests and enforce admin-only actions.
export const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
