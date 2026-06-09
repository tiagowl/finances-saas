# Documentação de Requisitos - Finances SaaS

## 1. Visão Geral do Produto

### 1.1 Propósito
Sistema web para controle financeiro que permite o gerenciamento completo de receitas e despesas (avulsas e recorrentes), categorização por tipo e visualização de indicadores financeiros em dashboard.

### 1.2 Público-Alvo
- Usuários pessoa física que desejam organizar finanças pessoais
- Pequenos empresários que precisam controlar fluxo de caixa
- Gestores financeiros que necessitam de visão consolidada

---

## 2. Requisitos Funcionais

| ID | Módulo | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Categorias | CRUD de categorias com nome, observações (rich text) e orçamento máximo | Must Have |
| RF02 | Despesas Avulsas | CRUD com nome, observações (rich text), preço, data da despesa, categoria | Must Have |
| RF03 | Despesas Recorrentes | CRUD com nome, preço, observações (rich text), categoria | Must Have |
| RF04 | Receitas Avulsas | CRUD com nome, preço, observações (rich text), data da receita, categoria | Must Have |
| RF05 | Receitas Recorrentes | CRUD com nome, preço, observações (rich text), categoria | Must Have |
| RF06 | Dashboard | Estatísticas de totais (despesas avulsas, recorrentes, últimos gastos) | Could Have |
| RF07 | Indicadores | Exibição do total de preços nas páginas de listagem | Should Have |

---

## 3. Modelo de Dados

### 3.1 Entidades

```
Category
├── id: UUID
├── name: String (único)
├── notes: RichText (opcional)
├── maxBudget: Decimal (opcional)
├── createdAt: DateTime
└── updatedAt: DateTime

OccasionalExpense
├── id: UUID
├── name: String
├── notes: RichText (opcional)
├── price: Decimal
├── date: DateTime
├── categoryId: UUID (FK → Category)
├── createdAt: DateTime
└── updatedAt: DateTime

RecurringExpense
├── id: UUID
├── name: String
├── notes: RichText (opcional)
├── price: Decimal
├── categoryId: UUID (FK → Category)
├── createdAt: DateTime
└── updatedAt: DateTime

OccasionalRevenue
├── id: UUID
├── name: String
├── notes: RichText (opcional)
├── price: Decimal
├── date: DateTime
├── categoryId: UUID (FK → Category)
├── createdAt: DateTime
└── updatedAt: DateTime

RecurringRevenue
├── id: UUID
├── name: String
├── notes: RichText (opcional)
├── price: Decimal
├── categoryId: UUID (FK → Category)
├── createdAt: DateTime
└── updatedAt: DateTime
```

### 3.2 Relacionamentos
- Category 1:N → OccasionalExpense
- Category 1:N → RecurringExpense
- Category 1:N → OccasionalRevenue
- Category 1:N → RecurringRevenue

---

## 4. Stack Tecnológica

### Frontend
- **Framework**: React 18+
- **Estilização**: Tailwind CSS
- **Estado Global**: Zustand
- **Requisições HTTP**: axios ou fetch nativo

### Backend
- **Runtime**: Node.js
- **Framework HTTP**: Fastify
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Validação**: Zod
- **Documentação API**: Swagger (via @fastify/swagger)
- **Arquitetura**: Clean Architecture + DDD + Repository Pattern

### Infraestrutura
- **Banco de Dados**: Neon (PostgreSQL Serverless)
- **Hospedagem**: Render

---

## 5. Regras de Negócio

| RN | Descrição |
|----|-----------|
| RN01 | Toda despesa/receita deve estar associada a uma categoria |
| RN02 | O nome de uma categoria deve ser único no sistema |
| RN03 | O orçamento máximo da categoria é opcional e deve ser um valor positivo |
| RN04 | Uma categoria não pode ser excluída se estiver vinculada a alguma transação |
| RN05 | Despesas e receitas avulsas possuem data; recorrentes não |
| RN06 | O preço de qualquer transação deve ser um valor numérico positivo |
| RN07 | Os totais nas páginas de listagem devem ser calculados dinamicamente |
| RN08 | As observações suportam rich text (formatação básica: negrito, itálico, listas) |

---

## 6. Jornada do Usuário (Happy Path)

1. Usuário acessa o sistema
2. Usuário cadastra categorias (ex: Alimentação, Transporte, Salário)
3. Usuário cadastra despesas avulsas (ex: "Supermercado - R$ 200 - Alimentação")
4. Usuário cadastra despesas recorrentes (ex: "Aluguel - R$ 1500")
5. Usuário cadastra receitas avulsas (ex: "Freelance - R$ 500")
6. Usuário cadastra receitas recorrentes (ex: "Salário - R$ 5000")
7. Usuário visualiza totais em cada página de listagem
8. Usuário acessa o dashboard para ver estatísticas consolidadas

---

## 7. Requisitos Não Funcionais

| RNF | Descrição |
|-----|-----------|
| RNF01 | O sistema deve ser responsivo (mobile e desktop) |
| RNF02 | O tempo de resposta da API deve ser < 500ms (p95) |
| RNF03 | O banco de dados deve utilizar Neon (PostgreSQL serverless) |
| RNF04 | A API deve ser documentada com Swagger |
| RNF05 | O backend deve seguir Clean Architecture com camadas bem definidas |
| RNF06 | Validações de entrada devem ser feitas com Zod |
| RNF07 | O código deve ser type-safe com TypeScript |
| RNF08 | O frontend deve utilizar gerenciamento de estado global com Zustand |
