import { Server } from "socket.io";
import { INotification } from "./infrastructure/models/NotificationModel";

let io: Server | null = null;

export const setSocketInstance = (server: Server) => {
  io = server;
};

export const emitNotification = (
  userId: string,
  notification: INotification
) => {
  if (!io) return;

  io.to(userId).emit("notification:new", {
    _id: notification._id,
    type: notification.type,
    content: notification.content,
    count: notification.count,
    actors: notification.actors,
    post: notification.post,
    comment: notification.comment,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  });
};