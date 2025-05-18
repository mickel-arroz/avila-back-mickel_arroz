// src/types/express/index.d.ts
import { InstanceType } from "mongoose";
import { User } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User>;
    }
  }
}
