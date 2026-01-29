# Payment Records API

API REST para gerenciamento de registros financeiros, contas bancárias e transações.

## Tecnologias

- Node.js 18+
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT (autenticação)
- Zod (validação de schemas)
- Class Validator (validação de DTOs)
- Nodemailer (envio de emails)

## Instalação

### Requisitos

- Node.js 18 ou superior
- PostgreSQL
- npm ou yarn

### Configuração

1. Clone o repositório:

```bash
git clone <repository-url>
cd payment_records
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

```env
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=payment_records
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

4. Inicie o banco de dados com Docker (opcional):

```bash
docker-compose up -d
```

5. Execute as migrations do banco de dados:

```bash
npm run migration:run
```

6. Inicie o servidor:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

## Padrões de Request e Response

### Padrão de Request

Todas as requisições que requerem autenticação devem incluir o token JWT no cookie `access_token` ou no header `Authorization`:

```http
Authorization: Bearer <token>
```

Requisições com body devem enviar dados em formato JSON:

```json
{
  "campo": "valor"
}
```

### Padrão de Response

Todas as respostas seguem o padrão `DefaultMessage`:

**Sucesso:**

```json
{
  "success": true,
  "message": "Mensagem descritiva da operação",
  "data": {
    "objeto": "dados retornados"
  }
}
```

**Erro:**

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "status": 400
}
```

### Códigos HTTP

- `200` - OK (operação bem-sucedida)
- `201` - Created (recurso criado com sucesso)
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (conflito, ex: email já existe)
- `500` - Internal Server Error (erro interno)

## Endpoints da api
acesse `/api`

## Estrutura do Projeto

```
src/
├── app.ts                    # Arquivo principal da aplicação
├── docs/
│   ├── swagger.ts     
├── lib/
│   ├── enums.ts              # Enumerações (tipos de conta, transação, etc)
│   ├── schema.ts             # Schemas Zod para validação
│   ├── types.ts              # Tipos TypeScript
│   └── utils.ts              # Funções utilitárias
├── middlewares/
│   ├── bodyparser.ts         # Middleware de validação Zod
│   ├── error.ts              # Middleware de tratamento de erros
│   └── jwt.ts                # Middleware de validação JWT
├── modules/
│   ├── Auth/                 # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.factory.ts
│   │   ├── dto/
│   │   ├── email/
│   │   └── repository/
│   ├── User/                 # Módulo de usuário
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   ├── user.factory.ts
│   │   ├── dto/
│   │   ├── entity/
│   │   └── repository/
│   ├── Bank/                 # Módulo de banco
│   │   ├── bank.controller.ts
│   │   ├── bank.service.ts
│   │   ├── bank.routes.ts
│   │   ├── bank.factory.ts
│   │   ├── dto/
│   │   └── entity/
│   ├── Account/              # Módulo de conta bancária
│   │   ├── account.controller.ts
│   │   ├── account.service.ts
│   │   ├── account.routes.ts
│   │   ├── account.factory.ts
│   │   ├── dto/
│   │   └── entity/
│   └── Transaction/          # Módulo de transação
│       ├── transaction.controller.ts
│       ├── transaction.service.ts
│       ├── transaction.routes.ts
│       ├── transaction.factory.ts
│       ├── dto/
│       └── entity/
└── shared/
    ├── db/
    │   └── data-source.ts    # Configuração TypeORM
    └── email.service.ts      # Serviço de email
```

## Padrões de Arquitetura

### Repository Pattern

Cada módulo possui um repository para acesso ao banco de dados.

### Factory Pattern

Controllers são criados através de factories que injetam as dependências necessárias.

### DTO Pattern

Data Transfer Objects validados com class-validator para entrada de dados.

### Middleware Chain

Validação de schemas (Zod) → Autenticação (JWT) → Controller → Error Handler

## Scripts Disponíveis

```bash
npm start              # Inicia o servidor em modo desenvolvimento
npm run build          # Compila o TypeScript
npm run migration:generate  # Gera uma nova migration
npm run migration:run       # Executa as migrations pendentes
```

## Segurança

- Senhas são criptografadas com bcrypt
- Autenticação via JWT com tokens de acesso e refresh
- Validação de ownership: usuários só podem acessar seus próprios recursos
- Validação de entrada com Zod e class-validator
- Proteção contra duplicatas em campos únicos
