import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class UserResponseDto {
  @Expose()
  _id!: string;

  @Expose()
  fullName!: string;

  @Expose()
  email!: string;

  @Expose()
  username!: string;

  @Expose()
  profilePicture?: string;

  @Expose()
  coverPhoto?: string;

  @Expose()
  gender?: string;

  @Expose()
  marital_status?: string;

  @Expose()
  bio?: string;

  @Expose()
  phone?: string;

  @Expose()
  location?: string;

  @Expose()
  website?: string;

  @Expose()
  friends!: string[];

  @Expose()
  followers!: string[];

  @Expose()
  following!: string[];

  @Expose()
  posts!: string[];

  @Expose()
  groups!: string[];

  @Expose()
  pages!: string[];

  @Expose()
  friendRequests!: string[];

  @Expose()
  blockedUsers!: string[];

  @Expose()
  stories!: string[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
