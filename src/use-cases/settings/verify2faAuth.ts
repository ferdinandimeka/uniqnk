import { SettingsRepository } from "../../domain/interfaces/settingRepository";

export class Verify2faAuth {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string, token: string): Promise<boolean> {
    return this.settingsRepository.verify2FA(userId, token);
  }
}
