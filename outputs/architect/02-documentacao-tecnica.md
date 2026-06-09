# Documentação Técnica - Finances SaaS

## 1. Stack Tecnológica Detalhada

### Frontend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18+ | Biblioteca de UI |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Estilização utilitária |
| Zustand | 4+ | Gerenciamento de estado global |
| React Router | 6+ | Roteamento SPA |
| TipTap/Quill | - | Editor rich text |
| Lucide React | - | Ícones |
| date-fns | - | Manipulação de datas |
| zod | 3+ | Validação de formulários (reuso no frontend) |

### Backend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 20+ LTS | Runtime |
| TypeScript | 5+ | Type safety |
| Fastify | 4+ | HTTP Framework |
| Prisma | 5+ | ORM + Migrations |
| Zod | 3+ | Validação de schemas |
| @fastify/swagger | - | Documentação OpenAPI |
| @fastify/cors | - | CORS |
| tsx | - | Execução TypeScript em dev |

### Banco de Dados

| Tecnologia | Finalidade |
|------------|------------|
| Neon (PostgreSQL) | Banco serverless |
| Prisma Migrate | Versionamento de schema |

### Infraestrutura

| Serviço | Finalidade |
|---------|------------|
| Render (Web Service) | Hospedagem do backend |
| Render (Static Site) | Hospedagem do frontend (opcional) |
| GitHub | Versionamento + CI/CD |

---

## 2. API - Endpoints REST

### Categorias
```
POST   /api/categories          → Criar categoria
GET    /api/categories          → Listar categorias
GET    /api/categories/:id      → Obter categoria
PUT    /api/categories/:id      → Atualizar categoria
DELETE /api/categories/:id      → Excluir categoria
```

### Despesas Avulsas
```
POST   /api/expenses/occasional          → Criar
GET    /api/expenses/occasional          → Listar (query: category, startDate, endDate)
GET    /api/expenses/occasional/:id      → Obter
PUT    /api/expenses/occasional/:id      → Atualizar
DELETE /api/expenses/occasional/:id      → Excluir
GET    /api/expenses/occasional/total    → Total agregado
```

### Despesas Recorrentes
```
POST   /api/expenses/recurring           → Criar
GET    /api/expenses/recurring           → Listar (query: category)
GET    /api/expenses/recurring/:id       → Obter
PUT    /api/expenses/recurring/:id       → Atualizar
DELETE /api/expenses/recurring/:id       → Excluir
GET    /api/expenses/recurring/total     → Total agregado
```

### Receitas Avulsas
```
POST   /api/revenues/occasional          → Criar
GET    /api/revenues/occasional          → Listar (query: category, startDate, endDate)
GET    /api/revenues/occasional/:id      → Obter
PUT    /api/revenues/occasional/:id      → Atualizar
DELETE /api/revenues/occasional/:id      → Excluir
GET    /api/revenues/occasional/total    → Total agregado
```

### Receitas Recorrentes
```
POST   /api/revenues/recurring           → Criar
GET    /api/revenues/recurring           → Listar (query: category)
GET    /api/revenues/recurring/:id       → Obter
PUT    /api/revenues/recurring/:id       → Atualizar
DELETE /api/revenues/recurring/:id       → Excluir
GET    /api/revenues/recurring/total     → Total agregado
```

### Dashboard
```
GET    /api/dashboard                    → Estatísticas (query: period)
```

---

## 3. Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @unique
  notes     String?  @db.Text
  maxBudget Decimal? @db.Decimal(10, 2)

  occasionalExpenses  OccasionalExpense[]
  recurringExpenses   RecurringExpense[]
  occasionalRevenues  OccasionalRevenue[]
  recurringRevenues   RecurringRevenue[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OccasionalExpense {
  id         String   @id @default(uuid()) @db.Uuid
  name       String
  notes      String?  @db.Text
  price      Decimal  @db.Decimal(10, 2)
  date       DateTime
  categoryId String   @db.Uuid
  category   Category @relation(fields: [categoryId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RecurringExpense {
  id         String   @id @default(uuid()) @db.Uuid
  name       String
  notes      String?  @db.Text
  price      Decimal  @db.Decimal(10, 2)
  categoryId String   @db.Uuid
  category   Category @relation(fields: [categoryId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OccasionalRevenue {
  id         String   @id @default(uuid()) @db.Uuid
  name       String
  notes      String?  @db.Text
  price      Decimal  @db.Decimal(10, 2)
  date       DateTime
  categoryId String   @db.Uuid
  category   Category @relation(fields: [categoryId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RecurringRevenue {
  id         String   @id @default(uuid()) @db.Uuid
  name       String
  notes      String?  @db.Text
  price      Decimal  @db.Decimal(10, 2)
  categoryId String   @db.Uuid
  category   Category @relation(fields: [categoryId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 4. Variáveis de Ambiente

```env
# Backend
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/finances?sslmode=require"
NODE_ENV="development" # ou "production"
PORT=3000
HOST="0.0.0.0"

# Frontend
VITE_API_URL="https://finances-api.onrender.com"
```

---

## 5. Segurança

| Aspecto | Implementação |
|---------|--------------|
| **Autenticação** | JWT (futuro, fora do MVP) |
| **CORS** | Configurado via @fastify/cors (origens permitidas) |
| **Validação** | Zod em todas as entradas |
| **SQL Injection** | Prevenido pelo Prisma ORM (parameterized queries) |
| **HTTPS** | Forçado pelo Render (TLS automático) |
| **Headers** | Helmet via Fastify |
| **Rate Limiting** | @fastify/rate-limit |

---

## 6. Performance

| Estratégia | Detalhes |
|------------|----------|
| **Índices DB** | Índices em categoryId, date nas tabelas de transações |
| **Paginação** | cursor-based pagination nas listagens |
| **Agregações** | Dashboard usa Prisma aggregate (SUM, COUNT) diretamente no banco |
| **Conexão Neon** | Pool de conexões (serverless) |
| **Bundle Frontend** | Vite com code splitting por página |
| **Lazy Loading** | Componentes carregados sob demanda |

---

## 7. Tratamento de Erros

```typescript
// Estrutura de erro padronizada
interface ApiError {
  statusCode: number;
  message: string;
  errors?: FieldError[];
  timestamp: string;
}

interface FieldError {
  field: string;
  message: string;
}
```

Códigos HTTP utilizados:
- `200` - Sucesso
- `201` - Criado
- `400` - Erro de validação (Zod)
- `404` - Não encontrado
- `409` - Conflito (ex: nome de categoria duplicado)
- `422` - Entidade não processável
- `500` - Erro interno
