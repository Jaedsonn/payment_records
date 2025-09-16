import { IsNotEmpty, IsString } from 'class-validator';

export class createBankDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    account: string;
}