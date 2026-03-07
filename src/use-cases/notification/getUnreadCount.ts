import { NotificationRepository } from "../../domain/interfaces/notificationRepository";

export class GetUnreadCount {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return await this.notificationRepository.getUnreadCount(userId);
  }
}