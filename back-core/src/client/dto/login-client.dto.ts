import { IsNotEmpty } from 'class-validator'

export class LoginClient {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    motDePasse: string;
}