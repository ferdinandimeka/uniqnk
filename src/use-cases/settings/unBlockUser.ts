import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class UnBlockUser {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string, blockedId: string): Promise<Settings> {
    return this.settingsRepository.unBlockUser(userId, blockedId);
  }
}
