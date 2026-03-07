import { Notification } from "../domain/entities/Notification";
import { INotification } from "../infrastructure/models/NotificationModel";

export class NotificationMapper {
  static mapToDomain(doc: INotification): Notification {
    return new Notification(
      doc._id,
      doc.user,
      doc.type,
      doc.actors,
      doc.content,
      doc.count,
      doc.post,
      doc.comment,
      doc.isRead,
      doc.createdAt,
      doc.updatedAt
    );
  }
}