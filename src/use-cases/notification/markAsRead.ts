import { NotificationRepository } from "../../domain/interfaces/notificationRepository";

export class MarkAsRead {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId, userId);
  }
}
