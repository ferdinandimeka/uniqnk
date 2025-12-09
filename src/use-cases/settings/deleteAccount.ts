import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class DeleteAccount {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string): Promise<Settings> {
    return this.settingsRepository.deleteAccount(userId);
  }
}
