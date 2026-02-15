#  Payment Records API

[![CI Pipeline](https://github.com/jaedson/payment_records/workflows/CI%20pipeline/badge.svg)](https://github.com/jaedson/payment_records/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

API REST robusta e escalável para gerenciamento completo de registros financeiros, contas bancárias e transações, com autenticação segura e documentação interativa.

## Features

- **Autenticação JWT** com tokens de acesso e refresh
- **Gerenciamento de Usuários** com validação de ownership
- **Gestão de Bancos** com seeds pré-configurados  
- **Contas Bancárias** com diferentes tipos (corrente, poupança, investimento)
- **Transações Financeiras** (receitas, despesas, transferências)
- **Notificações por Email** (boas-vindas, reset de senha)
- **Documentação Swagger/OpenAPI** em `/api`
- **Cobertura de Testes** (unitários e integração)
- **Docker & Docker Compose** para ambiente de desenvolvimento
- **Redis** para cache e sessões
- **CI/CD** com GitHub Actions

## Tecnologias

### Core
- **Node.js 18+** - Runtime JavaScript
- **TypeScript 5.9** - Linguagem tipada
- **Express 5** - Framework web

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **TypeORM 0.3** - ORM para TypeScript
- **Redis 5** - Cache e gerenciamento de sessões

### Autenticação & Segurança
- **JWT** - Tokens de autenticação
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de schemas
- **class-validator** - Validação de DTOs

### Ferramentas
- **Swagger/OpenAPI** - Documentação interativa
- **Nodemailer** - Envio de emails
- **ESLint** - Linting de código
- **Jest** - Framework de testes
- **Docker** - Containerização

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) 18 ou superior
- [PostgreSQL](https://www.postgresql.org/) 14+
- [Redis](https://redis.io/) 5+
- [Docker](https://www.docker.com/) e Docker Compose (opcional, mas recomendado)
- npm ou yarn

## Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/payment_records.git
cd payment_records
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3000
FRONTEND_URL=http://localhost:5173

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=payment_records

# JWT
ACCESS_SECRET=seu-access-secret-aqui
ACCESS_EXPIRE=15m
REFRESH_SECRET=seu-refresh-secret-aqui
REFRESH_EXPIRE=7d
RESET_SECRET=seu-reset-secret-aqui
RESET_EXPIRE=15m

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app

# Redis
REDIS_URL=redis://localhost:6379
```

### 4. Inicie os serviços com Docker

```bash
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta `5432`
- Redis na porta `6379`

### 5. Execute o servidor

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000`.

### 6. Acesse a documentação

Abra seu navegador em: `http://localhost:3000/api`



### Padrões de Request e Response

#### Request

Requisições autenticadas devem incluir o token JWT:

**Cookie:**
```
access_token=<seu-token-jwt>
```

**Ou Header:**
```http
Authorization: Bearer <seu-token-jwt>
```

**Body (JSON):**
```json
{
  "campo": "valor"
}
```

#### Response

Todas as respostas seguem o padrão `DefaultMessage`:

**Sucesso:**

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {
    "id": "123",
    "name": "Exemplo"
  }
}
```

**Erro:**

```json
{
  "success": false,
  "message": "Mensagem de erro descritiva",
  "status": 400
}
```

### Principais Endpoints

#### Autenticação (`/auth`)
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/refresh` - Renovar access token
- `POST /auth/logout` - Logout do usuário
- `POST /auth/forgot-password` - Solicitar reset de senha
- `POST /auth/reset-password` - Resetar senha

#### Usuários (`/user`)
- `GET /user/me` - Obter dados do usuário autenticado
- `PATCH /user/me` - Atualizar dados do usuário
- `DELETE /user/me` - Deletar conta do usuário

#### Bancos (`/bank`)
- `GET /bank` - Listar todos os bancos
- `GET /bank/:id` - Obter banco por ID
- `POST /bank` - Criar novo banco
- `PATCH /bank/:id` - Atualizar banco
- `DELETE /bank/:id` - Deletar banco

#### Contas (`/account`)
- `GET /account` - Listar contas do usuário
- `GET /account/:id` - Obter conta por ID
- `POST /account` - Criar nova conta
- `PATCH /account/:id` - Atualizar conta
- `DELETE /account/:id` - Deletar conta

#### Transações (`/transaction`)
- `GET /transaction` - Listar transações do usuário
- `GET /transaction/:id` - Obter transação por ID
- `POST /transaction` - Criar nova transação
- `PATCH /transaction/:id` - Atualizar transação
- `DELETE /transaction/:id` - Deletar transação

#### Saúde
- `GET /health` - Status da API

## Estrutura do Projeto

```
payment_records/
├── .github/
│   └── workflows/
│       └── ci.yaml              # Pipeline CI/CD
├── src/
│   ├── app.ts                   # Ponto de entrada da aplicação
│   ├── core/
│   │   ├── abstractions/        # Interfaces e abstrações
│   │   │   └── email.ts
│   │   └── interfaces/
│   │       └── logger.ts
│   ├── docs/
│   │   └── swagger.ts           # Configuração Swagger/OpenAPI
│   ├── lib/
│   │   ├── enums.ts             # Enumerações (tipos de conta, transação)
│   │   ├── schema.ts            # Schemas Zod para validação
│   │   ├── types.ts             # Tipos TypeScript customizados
│   │   └── utils.ts             # Funções utilitárias
│   ├── middlewares/
│   │   ├── bodyparser.ts        # Validação Zod de requests
│   │   ├── error.ts             # Tratamento centralizado de erros
│   │   ├── jwt.ts               # Validação e autenticação JWT
│   │   └── loggger.middleware.ts
│   ├── modules/
│   │   ├── Account/             # Módulo de Contas Bancárias
│   │   │   ├── account.controller.ts
│   │   │   ├── account.service.ts
│   │   │   ├── account.routes.ts
│   │   │   ├── account.factory.ts
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── entity/          # Entidades TypeORM
│   │   ├── Auth/                # Módulo de Autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.factory.ts
│   │   │   ├── dto/
│   │   │   └── email/           # Templates de email
│   │   ├── Bank/                # Módulo de Bancos
│   │   ├── redis/               # Módulo Redis
│   │   ├── Transaction/         # Módulo de Transações
│   │   └── User/                # Módulo de Usuários
│   ├── shared/
│   │   ├── db/
│   │   │   └── data-source.ts   # Configuração TypeORM
│   │   ├── seeds/               # Seeds do banco de dados
│   │   │   ├── bank.seed.ts
│   │   │   └── index.ts
│   │   ├── email.service.ts     # Serviço de envio de emails
│   │   └── env.ts               # Validação de variáveis de ambiente
│   └── tests/
│       ├── integration/         # Testes de integração
│       │   ├── account.service.spec.ts
│       │   ├── auth.service.spec.ts
│       │   ├── bank.service.spec.ts
│       │   ├── user.service.spec.ts
│       │   ├── redis.service.spec.ts
│       │   └── postgres-db.ts
│       └── unit/                # Testes unitários
│           ├── middlewares.spec.ts
│           └── utils.spec.ts
├── coverage/                    # Relatórios de cobertura de testes
├── docker-compose.yaml          # Configuração Docker
├── init-db.sql                  # Script de inicialização do DB
├── jest.config.js               # Configuração Jest
├── tsconfig.json                # Configuração TypeScript
├── eslint.config.mts            # Configuração ESLint
└── package.json
```

### Executar Testes

```bash
# Todos os testes
npm test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Testes com cobertura
npm run test:coverage
```

### Estrutura de Testes

- **Testes Unitários** (`src/tests/unit/`): Testam funções isoladas (utils, middlewares)
- **Testes de Integração** (`src/tests/integration/`): Testam serviços com banco de dados real

### Cobertura

Os relatórios de cobertura são gerados em `coverage/` e incluem:
- HTML report: `coverage/lcov-report/index.html`
- LCOV: `coverage/lcov.info`
- Clover: `coverage/clover.xml`

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot-reload |
| `npm run build` | Compila o TypeScript para JavaScript (dist/) |
| `npm start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa o ESLint para análise de código |
| `npm run test:unit` | Executa testes unitários |
| `npm run test:integration` | Executa testes de integração |

## CI/CD

O projeto utiliza **GitHub Actions** para integração e entrega contínuas.

### Pipeline Automático

```yaml
Trigger: Push/Pull Request
    ↓
  Build
    ├── Checkout código
    ├── Setup Node.js 18
    ├── Instalar dependências
    ├── Lint código (ESLint)
    └── Build TypeScript
    ↓
  Tests
    ├── Iniciar containers (PostgreSQL + Redis)
    ├── Executar testes unitários
    ├── Executar testes de integração
    └── Gerar relatório de cobertura
    ↓
```

### Arquivo de Configuração

Veja [.github/workflows/ci.yaml](.github/workflows/ci.yaml) para detalhes.

### Healthcheck

Os containers possuem healthchecks configurados para garantir disponibilidade antes dos testes.


## Licença

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Jaedson Macedo**
- Email: jaedsonnm@gmail.com
- GitHub: [@jaedson](https://github.com/jaedson)

---