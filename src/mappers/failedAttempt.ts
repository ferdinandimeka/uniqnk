import { UserModel } from "../infrastructure/models/UserModel";

const MAX_PIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

const handleFailedPinAttempt = async (userId: string, pinData: any) => {
  const failedAttempts = (pinData.failedAttempts || 0) + 1;

  const update: any = {
    "security.transactionPin.failedAttempts": failedAttempts,
  };

  if (failedAttempts >= MAX_PIN_ATTEMPTS) {
    update["security.transactionPin.lockedUntil"] =
      new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
  }

  await UserModel.updateOne({ _id: userId }, { $set: update });
};
export { handleFailedPinAttempt };