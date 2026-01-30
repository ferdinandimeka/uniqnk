import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class UpdateAuthSettings {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(
    userId: string,
    data: Settings
  ): Promise<Settings> {
    return this.settingsRepository.updateAuth(userId, data);
  }
}
