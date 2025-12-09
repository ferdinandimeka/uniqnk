import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { Settings } from "../../domain/entities/Settings";

export class ReportProblem {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string, message: string): Promise<Settings> {
    return this.settingsRepository.reportMessage(userId, message);
  }
}
