import "reflect-metadata";
import { BankSeed } from "./bank.seed";

export const runSeeds = async () => {
    await BankSeed.run();
}