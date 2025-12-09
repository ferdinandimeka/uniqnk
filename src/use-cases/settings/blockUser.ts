import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class BlockUser {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string, blockedId: string): Promise<Settings> {
    return this.settingsRepository.blockUser(userId, blockedId);
  }
}
