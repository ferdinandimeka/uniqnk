import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { UpdateNotificationDTO } from "../../dtos/update-notification.dto";

export class UpdateNotificationSettings {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(
    userId: string,
    data: UpdateNotificationDTO
  ): Promise<UpdateNotificationDTO> {
    return this.settingsRepository.updateNotificationSettings(userId, data);
  }
}
