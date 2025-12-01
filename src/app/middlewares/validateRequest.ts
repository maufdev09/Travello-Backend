/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (zodSchema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Validating request body:", req.body);
    
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
