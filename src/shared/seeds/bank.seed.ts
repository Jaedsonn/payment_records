import { AppDataSource } from "@shared/db/data-source";
import { Bank } from "@modules/Bank/entity/bank.entity";

export class BankSeed {
  static async run() {
    const bankRepository = AppDataSource.getRepository(Bank);

    const banks = [
      {
        name: "Banco do Brasil",
        code: "001",
        description: "Banco do Brasil S.A.",
        isActive: true,
      },
      {
        name: "Bradesco",
        code: "237",
        description: "Banco Bradesco S.A.",
        isActive: true,
      },
      {
        name: "Caixa Econômica Federal",
        code: "104",
        description: "Caixa Econômica Federal",
        isActive: true,
      },
      {
        name: "Itaú Unibanco",
        code: "341",
        description: "Itaú Unibanco S.A.",
        isActive: true,
      },
      {
        name: "Santander",
        code: "033",
        description: "Banco Santander (Brasil) S.A.",
        isActive: true,
      },
      {
        name: "Nubank",
        code: "260",
        description: "Nu Pagamentos S.A. (Nubank)",
        isActive: true,
      },
      {
        name: "Inter",
        code: "077",
        description: "Banco Inter S.A.",
        isActive: true,
      },
      {
        name: "BTG Pactual",
        code: "208",
        description: "Banco BTG Pactual S.A.",
        isActive: true,
      },
      {
        name: "C6 Bank",
        code: "336",
        description: "Banco C6 S.A.",
        isActive: true,
      },
      {
        name: "PicPay",
        code: "380",
        description: "Banco PicPay S.A.",
        isActive: true,
      },
      {
        name: "XP Investimentos",
        code: "348",
        description: "Banco XP S.A.",
        isActive: true,
      },
      {
        name: "Banco Pan",
        code: "623",
        description: "Banco Pan S.A.",
        isActive: true,
      },
      {
        name: "Banco Original",
        code: "212",
        description: "Banco Original S.A.",
        isActive: true,
      },
      {
        name: "Sicoob",
        code: "756",
        description: "Sistema de Cooperativas de Crédito do Brasil",
        isActive: true,
      },
      {
        name: "Sicredi",
        code: "748",
        description: "Sistema de Crédito Cooperativo",
        isActive: true,
      },
    ];

    for(const bankData of banks){
        console.info("Seeding bank:", bankData.name);
        const existingBank = await bankRepository.findOne({ where: { code: bankData.code } });
        if(!existingBank){
            const bank = bankRepository.create(bankData);
            await bankRepository.save(bank);
        } else {
            console.info("Bank already exists:", bankData.name);
        }
    }
    
  }
}
