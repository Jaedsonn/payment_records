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

## Endpoints da API

### Autenticação (`/auth`)

#### POST /auth/register

Registra um novo usuário.

**Request Body:**

```json
{
  "name": "João Silva",
  "age": 25,
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "age": 25
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
}
```

#### POST /auth/login

Autentica um usuário existente.

**Request Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "jwt-refresh-token"
    }
  }
}
```

#### POST /auth/refresh-token

Renova o access token usando o refresh token.

**Request:** Cookie `refresh_token` ou body com `refreshToken`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

#### POST /auth/logout

Encerra a sessão do usuário.

**Request:** Requer autenticação

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

#### POST /auth/forgot-password

Solicita redefinição de senha via email.

**Request Body:**

```json
{
  "email": "joao@example.com"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST /auth/reset-password

Redefine a senha usando o token recebido por email.

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "novaSenha123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Usuário (`/user`)

Todas as rotas requerem autenticação.

#### PUT /user/update

Atualiza informações do usuário autenticado.

**Request Body:** (todos os campos são opcionais)

```json
{
  "name": "João Silva Santos",
  "age": 26,
  "email": "novoemail@example.com",
  "password": "novaSenha456"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva Santos",
      "email": "novoemail@example.com",
      "age": 26
    }
  }
}
```

#### GET /user/info

Retorna informações do usuário autenticado incluindo suas contas.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "age": 25,
      "accounts": []
    }
  }
}
```

---

### Banco (`/bank`)

Todas as rotas requerem autenticação.

#### POST /bank/register

Registra um novo banco no sistema.

**Request Body:**

```json
{
  "name": "Banco do Brasil",
  "code": "001"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Bank registered successfully",
  "data": {
    "bank": {
      "id": "uuid",
      "name": "Banco do Brasil",
      "code": "001",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### GET /bank/all

Lista todos os bancos cadastrados.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Banks retrieved successfully",
  "data": {
    "banks": [
      {
        "id": "uuid",
        "name": "Banco do Brasil",
        "code": "001"
      }
    ]
  }
}
```

#### GET /bank/info/:id

Retorna informações de um banco específico.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Bank retrieved successfully",
  "data": {
    "bank": {
      "id": "uuid",
      "name": "Banco do Brasil",
      "code": "001",
      "accounts": []
    }
  }
}
```

#### GET /bank/search?name=nome

Busca banco por nome (query parameter).

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Bank retrieved successfully",
  "data": {
    "bank": {
      "id": "uuid",
      "name": "Banco do Brasil",
      "code": "001"
    }
  }
}
```

#### PUT /bank/update/:id

Atualiza informações de um banco.

**Request Body:** (campos opcionais)

```json
{
  "name": "Banco do Brasil S.A.",
  "code": "001"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Bank updated successfully",
  "data": {
    "bank": {
      "id": "uuid",
      "name": "Banco do Brasil S.A.",
      "code": "001"
    }
  }
}
```

#### DELETE /bank/delete/:id

Remove um banco do sistema.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Bank deleted successfully"
}
```

---

### Conta (`/account`)

Todas as rotas requerem autenticação. As contas pertencem ao usuário autenticado.

#### POST /account/create

Cria uma nova conta bancária para o usuário.

**Request Body:**

```json
{
  "name": "Conta Corrente Principal",
  "accountNumber": "12345-6",
  "agency": "0001",
  "balance": 1000.0,
  "isActive": true,
  "accountType": "Checking Account",
  "bankId": "uuid-do-banco"
}
```

**Valores para `accountType`:**

- `Checking Account`
- `Savings Account`
- `Business Account`
- `Join Account`
- `Student Account`
- `Investment Account`

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "account": {
      "id": "uuid",
      "name": "Conta Corrente Principal",
      "accountNumber": "12345-6",
      "agency": "0001",
      "balance": 1000.0,
      "isActive": true,
      "accountType": "Checking Account"
    }
  }
}
```

#### GET /account/list

Lista todas as contas do usuário autenticado.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Accounts retrieved successfully",
  "data": {
    "accounts": [
      {
        "id": "uuid",
        "name": "Conta Corrente",
        "accountNumber": "12345-6",
        "balance": 1000.0,
        "bank": {
          "name": "Banco do Brasil",
          "code": "001"
        }
      }
    ]
  }
}
```

#### GET /account/details/:id

Retorna detalhes de uma conta específica.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account retrieved successfully",
  "data": {
    "account": {
      "id": "uuid",
      "name": "Conta Corrente",
      "accountNumber": "12345-6",
      "agency": "0001",
      "balance": 1000.0,
      "isActive": true,
      "user": {},
      "bank": {},
      "transactions": []
    }
  }
}
```

#### GET /account/details/:accountNumber

Busca conta por número.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account retrieved successfully",
  "data": {
    "account": {
      "id": "uuid",
      "accountNumber": "12345-6",
      "balance": 1000.0
    }
  }
}
```

#### PUT /account/update

Atualiza uma conta (requer id no path params).

**Request Body:** (todos os campos são opcionais)

```json
{
  "name": "Conta Poupança",
  "accountNumber": "54321-0",
  "agency": "0002",
  "balance": 2000.0,
  "isActive": false,
  "accountType": "Savings Account"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account updated successfully",
  "data": {
    "account": {
      "id": "uuid",
      "name": "Conta Poupança",
      "accountNumber": "54321-0",
      "balance": 2000.0
    }
  }
}
```

#### DELETE /account/delete/:id

Remove uma conta.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

#### DELETE /account/alive-or-dead/:id

Alterna o status ativo/inativo da conta.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account activated successfully"
}
```

ou

```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

#### GET /account/balance/:id

Retorna o saldo da conta.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Account balance retrieved successfully",
  "data": {
    "balance": 1000.0
  }
}
```

---

### Transação (`/transaction`)

Todas as rotas requerem autenticação. As transações pertencem às contas do usuário.

#### POST /transaction/create

Cria uma nova transação e atualiza o saldo da conta.

**Request Body:**

```json
{
  "accountId": "uuid-da-conta",
  "amount": 100.0,
  "type": "Deposit",
  "description": "Depósito em dinheiro",
  "from": "Caixa Eletrônico",
  "to": "Minha Conta",
  "category": "Other"
}
```

**Valores para `type`:**

- `Deposit`
- `Withdrawal`
- `Transfer`
- `Payment`
- `Refund`
- `Fee`
- `Interest`
- `Adjustment`

**Valores para `category`:**

- `Groceries`
- `Utilities`
- `Rent`
- `Entertainment`
- `Transportation`
- `Healthcare`
- `Education`
- `Other`

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "transaction": {
      "id": "uuid",
      "amount": 100.0,
      "type": "Deposit",
      "description": "Depósito em dinheiro",
      "from": "Caixa Eletrônico",
      "to": "Minha Conta",
      "category": "Other",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### GET /transaction/list

Lista todas as transações das contas do usuário.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "amount": 100.0,
        "type": "Deposit",
        "description": "Depósito",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### GET /transaction/:id

Retorna detalhes de uma transação específica.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Transaction retrieved successfully",
  "data": {
    "transaction": {
      "id": "uuid",
      "amount": 100.0,
      "type": "Deposit",
      "description": "Depósito em dinheiro",
      "from": "Caixa Eletrônico",
      "to": "Minha Conta",
      "category": "Other",
      "account": {},
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### PUT /transaction/:id/update

Atualiza uma transação existente.

**Request Body:** (todos os campos são opcionais)

```json
{
  "amount": 150.0,
  "type": "Deposit",
  "description": "Depósito corrigido",
  "from": "Banco",
  "to": "Conta",
  "category": "Other"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "transaction": {
      "id": "uuid",
      "amount": 150.0,
      "description": "Depósito corrigido"
    }
  }
}
```

#### DELETE /transaction/:id

Remove uma transação e reverte o valor no saldo da conta.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

#### GET /transaction/summary

Retorna um resumo financeiro das transações do usuário.

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Transaction summary retrieved successfully",
  "data": {
    "summary": {
      "totalIncome": 5000.0,
      "totalExpenses": 2000.0,
      "balance": 3000.0,
      "transactionCount": 15
    }
  }
}
```

---

## Estrutura do Projeto

```
src/
├── app.ts                    # Arquivo principal da aplicação
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
