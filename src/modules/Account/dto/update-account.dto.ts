import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateAccountDto } from "./create-account.dto";

export class UpdateAccountDto implements Partial<CreateAccountDto>{
    @IsNumber()
    @IsNotEmpty()
    accountNumber: number;
}
