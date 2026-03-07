import { NotificationRepository } from "../../domain/interfaces/notificationRepository";

export class DeleteOlderThan {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(daysOld: number): Promise<void> {
    await this.notificationRepository.deleteOlderThan(daysOld);
  }
}
