import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // Extend the Request type with a user property
  }
}
