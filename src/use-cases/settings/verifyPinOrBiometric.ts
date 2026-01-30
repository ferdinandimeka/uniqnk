import { SettingsRepository } from "../../domain/interfaces/settingRepository";
// import { Settings } from "../../domain/entities/Settings";

export class VerifyPinOrBiometric {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(
    userId: string
  ): Promise<boolean> {
    return this.settingsRepository.verifyPinOrBiometric(userId);
  }
}

