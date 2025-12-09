import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class UpdateRestrictionSettings {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(
    userId: string,
    data: Partial<Settings>
  ): Promise<Settings> {
    return this.settingsRepository.updateRestrictions(userId, data);
  }
}
