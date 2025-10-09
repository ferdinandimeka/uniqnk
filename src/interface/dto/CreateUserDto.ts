import { IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    fullName!: string;

    @IsString()
    username!: string;

    @IsString()
    email!: string;

    @IsString()
    phone!: string;

    @IsString()
    password!: string;
}