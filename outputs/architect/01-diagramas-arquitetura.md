# Diagramas de Arquitetura - Finances SaaS

## 1. Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                              │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Single Page Application                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │  │
│  │  │  React   │ │  Tailwind│ │ Zustand  │ │  React Router    │  │  │
│  │  │ 18+     │ │  CSS     │ │ (State)  │ │  (Navigation)    │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Render - Node.js)                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Fastify HTTP Server                          │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │  │
│  │  │   Swagger    │ │    Zod      │ │   Routes/Controllers │   │  │
│  │  │  (Docs)      │ │ (Validation) │ │                      │   │  │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘   │  │
│  │                                                               │  │
│  │  ┌──────────────────── Clean Architecture ──────────────────┐ │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │ │  │
│  │  │  │  Domain     │ │  Application  │ │  Infra      │    │ │  │
│  │  │  │  (Entities) │ │  (Use Cases)  │ │  (Repos, DB) │    │ │  │
│  │  │  │  DDD        │ │  Services     │ │  Prisma ORM  │    │ │  │
│  │  │  └──────────────┘ └──────────────┘ └──────────────┘    │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ SSL/TLS
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      DATABASE (Neon - Serverless PostgreSQL)         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ┌─────────────┐    ┌──────────────────┐                     │  │
│  │  │  Category   │─── │ OccasionalExpense│                     │  │
│  │  │             │─── │ RecurringExpense │                     │  │
│  │  │             │─── │ OccasionalRevenue│                     │  │
│  │  │             │─── │ RecurringRevenue │                     │  │
│  │  └─────────────┘    └──────────────────┘                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitetura Backend - Clean Architecture + DDD

```
┌──────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HTTP Layer (Fastify)                                        │   │
│  │  - Routes                                                    │   │
│  │  - Controllers                                               │   │
│  │  - Request/Response DTOs                                     │   │
│  │  - Zod Validators                                            │   │
│  │  - Swagger Decorators                                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│                      APPLICATION LAYER                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Use Cases / Services                                        │   │
│  │  - CreateCategoryUseCase                                     │   │
│  │  - ListOccasionalExpensesUseCase                             │   │
│  │  - GetDashboardStatsUseCase                                  │   │
│  │  - etc.                                                      │   │
│  │                                                              │   │
│  │  Ports (Interfaces)                                          │   │
│  │  - ICategoryRepository                                       │   │
│  │  - IOccasionalExpenseRepository                              │   │
│  │  - IRecurringExpenseRepository                               │   │
│  │  - IOccasionalRevenueRepository                              │   │
│  │  - IRecurringRevenueRepository                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                                    │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Entities                                                    │   │
│  │  - Category (Aggregate Root)                                 │   │
│  │  - OccasionalExpense                                         │   │
│  │  - RecurringExpense                                          │   │
│  │  - OccasionalRevenue                                         │   │
│  │  - RecurringRevenue                                          │   │
│  │                                                              │   │
│  │  Value Objects                                               │   │
│  │  - Price                                                     │   │
│  │  - RichText                                                  │   │
│  │  - Budget                                                    │   │
│  │                                                              │   │
│  │  Domain Events (opcional)                                    │   │
│  │  - CategoryBudgetExceeded                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Database                                                    │   │
│  │  - Prisma ORM                                                │   │
│  │  - Repository Implementations                                │   │
│  │  - Migrations                                                │   │
│  │                                                              │   │
│  │  External Services                                           │   │
│  │  - Neon (PostgreSQL)                                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Fluxo de Requisição (Request Lifecycle)

```
CLIENT                    PRESENTATION                APPLICATION           DOMAIN        INFRA
  │                            │                          │                    │              │
  │  1. POST /api/expenses     │                          │                    │              │
  │───────────────────────────►│                          │                    │              │
  │                            │                          │                    │              │
  │                 2. Validate Input (Zod)               │                    │              │
  │                            │                          │                    │              │
  │                 3. Deserialize → DTO                  │                    │              │
  │                            │                          │                    │              │
  │                4. Call Use Case                       │                    │              │
  │                            │─────────────────────────►│                    │              │
  │                            │                          │                    │              │
  │                            │              5. Create Domain Entity         │              │
  │                            │                          │───────────────────►│              │
  │                            │                          │                    │              │
  │                            │              6. Persist via Repository      │              │
  │                            │                          │─────────────────────────────────►│
  │                            │                          │                    │              │
  │                            │              7. Return Result               │              │
  │                            │◄─────────────────────────│                    │              │
  │                            │                          │                    │              │
  │  8. HTTP Response          │                          │                    │              │
  │◄───────────────────────────│                          │                    │              │
  │                            │                          │                    │              │
```

---

## 4. Fluxo de Dados - Dashboard

```
┌──────────┐    ┌────────────┐    ┌──────────────────────┐
│  Client  │───►│  Dashboard │───►│ GetDashboardStats    │
│  (React) │    │  Route     │    │ UseCase              │
└──────────┘    └────────────┘    └───────┬──────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
          ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
          │ OccasionalExpense│  │ RecurringExpense │  │      Last       │
          │ Repository (SUM) │  │ Repository (SUM) │  │  Transactions   │
          └──────────────────┘  └──────────────────┘  │  (LIMIT 10)     │
                                                      └──────────────────┘
                    │                     │                     │
                    └─────────────────────┼─────────────────────┘
                                          ▼
                              ┌──────────────────────┐
                              │      Prisma Query     │
                              │     (Neon DB)         │
                              └──────────────────────┘
```

---

## 5. Diagrama de Componentes Frontend

```
┌──────────────────────────────────────────────────────────────────────┐
│                        REACT APPLICATION                             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │   Pages      │  │   Components    │  │      Store           │   │
│  │  - Dashboard │  │  - Layout       │  │  (Zustand)           │   │
│  │  - Expenses  │  │  - Card         │  │  - categoryStore     │   │
│  │  - Revenues  │  │  - Modal        │  │  - expenseStore      │   │
│  │  - Categories│  │  - Form         │  │  - revenueStore      │   │
│  └──────┬───────┘  │  - Toast        │  │  - dashboardStore    │   │
│         │          │  - DataTable    │  └──────────────────────┘   │
│         │          │  - RichEditor   │                              │
│         │          └──────────────────┘                             │
│         │                                                           │
│         └────────────────── API Layer (fetch/axios) ────────────────│
│                                    │                                │
└────────────────────────────────────┼────────────────────────────────┘
                                     │
                              ┌──────┴──────┐
                              │  Backend    │
                              │  (Fastify)  │
                              └─────────────┘
```

---

## 6. Fluxo de Deploy

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  GitHub  │───►│  Render      │───►│  Prisma      │───►│  Neon        │
│  Push    │    │  Build       │    │  Migrate     │    │  PostgreSQL  │
│          │    │  & Deploy    │    │  Deploy      │    │  (Prod)      │
└──────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## 7. Estrutura de Diretórios

```
finances-saas/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── OccasionalExpenses.tsx
│   │   │   ├── RecurringExpenses.tsx
│   │   │   ├── OccasionalRevenues.tsx
│   │   │   ├── RecurringRevenues.tsx
│   │   │   └── Categories.tsx
│   │   ├── components/
│   │   │   ├── ui/          (Button, Card, Modal, Input, Toast)
│   │   │   ├── layout/      (Sidebar, Header, BottomNav)
│   │   │   ├── forms/       (ExpenseForm, RevenueForm, CategoryForm)
│   │   │   └── shared/      (DataTable, RichEditor, BudgetBar)
│   │   ├── stores/
│   │   │   ├── categoryStore.ts
│   │   │   ├── expenseStore.ts
│   │   │   ├── revenueStore.ts
│   │   │   └── dashboardStore.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── Category.ts
│   │   │   │   ├── OccasionalExpense.ts
│   │   │   │   ├── RecurringExpense.ts
│   │   │   │   ├── OccasionalRevenue.ts
│   │   │   │   └── RecurringRevenue.ts
│   │   │   └── value-objects/
│   │   │       ├── Price.ts
│   │   │       └── RichText.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── category/
│   │   │   │   ├── expense/
│   │   │   │   ├── revenue/
│   │   │   │   └── dashboard/
│   │   │   └── ports/
│   │   │       └── repositories/
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   └── repositories/
│   │   │   └── server.ts
│   │   └── presentation/
│   │       ├── routes/
│   │       ├── controllers/
│   │       ├── dtos/
│   │       └── validators/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tsconfig.json
│   └── package.json
│
├── outputs/
└── README.md
```
