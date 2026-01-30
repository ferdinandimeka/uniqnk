import { SettingsRepository } from "../../domain/interfaces/settingRepository";

export class SecurityQuestion {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string, questionId: string, answer: string): Promise<void> {
    return this.settingsRepository.setupSecurityQuestion(userId, questionId, answer);
  }
}
