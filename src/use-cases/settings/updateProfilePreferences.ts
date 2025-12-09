import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class UpdateProfilePreferences {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(
    userId: string,
    data: Partial<Settings>
  ): Promise<Settings> {
    return this.settingsRepository.updateProfilePreferences(userId, data);
  }
}
