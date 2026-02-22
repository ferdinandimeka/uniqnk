import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class DisableAccount {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string, reason: string): Promise<Settings> {
    return this.settingsRepository.disableAccount(userId, reason);
  }
}
