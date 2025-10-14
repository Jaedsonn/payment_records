import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader } from "@lib/utils";
import { env } from "@shared/env";
import jwt from "jsonwebtoken";
import { AccessPayload } from "@lib/types";

declare global {
  namespace Express {
    interface Request {
      data?: AccessPayload;
    }
  }
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    token = extractTokenFromHeader(req.headers, "access_token");
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token não fornecido",
    });
  }
  try {
    const decoded = jwt.verify(token, env.ACCESS_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token inválido",
      });
    }
    req.data = decoded as AccessPayload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token expirado ou inválido",
    });
  }
}
