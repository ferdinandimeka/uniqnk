import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/userRepository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  /**
   * Follow another user
   * @param userId - ID of the user performing the follow
   * @param targetId - ID of the user being followed
   */
  async follow(userId: string, targetId: string): Promise<void> {
    const user = await this.findById(userId);
    const targetUser = await this.findById(targetId);

    if (!user || !targetUser) {
      throw new Error("User or target user not found");
    }

    // Prevent self-follow
    if (userId === targetId) {
      throw new Error("You cannot follow yourself");
    }

    // Add targetId to user's following if not already present
    if (!user.following?.includes(targetId)) {
      user.following = [...(user.following || []), targetId];
    }

    // Add userId to target's followers if not already present
    if (!targetUser.followers?.includes(userId)) {
      targetUser.followers = [...(targetUser.followers || []), userId];
    }

    await this.update(user);
    await this.update(targetUser);
  }

  /**
   * Unfollow a user
   * @param userId - ID of the user performing the unfollow
   * @param targetId - ID of the user being unfollowed
   */
  async unfollow(userId: string, targetId: string): Promise<void> {
    const user = await this.findById(userId);
    const targetUser = await this.findById(targetId);

    if (!user || !targetUser) {
      throw new Error("User or target user not found");
    }

    user.following = (user.following || []).filter((id) => id !== targetId);
    targetUser.followers = (targetUser.followers || []).filter((id) => id !== userId);

    await this.update(user);
    await this.update(targetUser);
  }
}
