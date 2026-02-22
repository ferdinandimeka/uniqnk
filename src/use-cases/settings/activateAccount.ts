import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class ReactivateAccount {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string): Promise<Settings> {
    return this.settingsRepository.reactivateAccount(userId);
  }
}
