import {IsString,  IsNumber, IsBoolean, IsEnum} from "class-validator"
import {Account as AccountType} from "@lib/enums"


export class CreateAccountDto {
    @IsString()
    name: string

    @IsNumber()
    balance: number

    @IsBoolean()
    isActive?: boolean

    @IsNumber()
    accountNumber: number

    @IsEnum(AccountType)
    accountType: AccountType
}