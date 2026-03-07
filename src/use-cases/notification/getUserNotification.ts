import { NotificationRepository } from "../../domain/interfaces/notificationRepository";

export class GetUserNotification {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, page: number, limit: number): Promise<any[]> {
    return await this.notificationRepository.getUserNotifications(userId, page, limit);
  }
}
