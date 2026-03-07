import { NotificationRepository } from "../../domain/interfaces/notificationRepository";

export class CreateOrAggregate {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(
    userId: string,
    type: string,
    actorId: string,
    postId: string | undefined,
    commentId: string | undefined,
    content: string
  ): Promise<void> {
    await this.notificationRepository.createOrAggregate({ userId, type, actorId, postId, commentId, content });
  }
}
