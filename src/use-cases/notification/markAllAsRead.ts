import { NotificationRepository } from "../../domain/interfaces/notificationRepository";

export class MarkAllAsRead {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(notificationId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(notificationId);
  }
}
