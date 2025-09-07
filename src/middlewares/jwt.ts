import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader } from "@lib/utils";
import {env} from "@shared/env";
import jwt from "jsonwebtoken";

declare global{
  namespace Express{
    interface Request{
      data?: any;
    }
  }
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = extractTokenFromHeader(req.headers, 'access_token');

  if(!token){
    return res.status(401).json({message: "Unauthorized"});
  }
  try {
      const decoded = jwt.verify(token, env.ACCESS_SECRET);

      if(!decoded) {
        return res.status(401).json({message: "Unauthorized"});
      }
      req.data = decoded;
      next();
  } catch (error) {
    return res.status(401).json({message: "Unauthorized"});
  }
}
