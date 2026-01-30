import { SettingsRepository } from "../../domain/interfaces/settingRepository";

export class Set2faAuth {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string): Promise<{qrcode: string; secret: string}> {
    return this.settingsRepository.setup2FA(userId);
  }
}
