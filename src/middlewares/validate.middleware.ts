import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

const validate = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error: any) {
    console.log("Zod validation error:", error);
    console.log("Zod error issues:", error.issues);
    return res.status(400).json({ message: "Validation failed", errors: error.issues });
  }
};

export default validate;
