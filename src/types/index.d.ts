// // In a file like types/express/index.d.ts

import { User } from "../domain/entities/User"; // adjust path if needed

declare global {
  namespace Express {
    interface Request {
      user?: User; // or `any` if you haven't defined a type yet
    }
  }
}


// src/types/express/index.d.ts
// import { User } from "../../domain/entities/User";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: User;
//   }
// }
