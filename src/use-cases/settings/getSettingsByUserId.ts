import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class GetSettingsByUserId {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string): Promise<Settings | null> {
    return this.settingsRepository.getByUserId(userId);
  }
}
