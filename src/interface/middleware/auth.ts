import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"
import { User } from "../../domain/entities/User";

interface AuthenticatedRequest extends Request {
    user?: User;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token  = req.header("Authorization")?.split(" ")[1];

    if (!token) { 
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) { 
            res.sendStatus(403);
            return;
        }
        req.user = user as User;
        next();
    })
}