import { IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    fullName!: string;

    @IsString()
    emailAddress!: string;

    @IsString()
    role!: string;

    @IsString()
    password!: string;
}