# Decisões Arquiteturais (ADRs) - Finances SaaS

---

## ADR-001: Clean Architecture + DDD para o Backend

### Contexto
O sistema precisa ser modular, testável e de fácil manutenção. Com múltiplas entidades de domínio (Category, OccasionalExpense, RecurringExpense, etc.) e regras de negócio bem definidas, é essencial separar responsabilidades.

### Decisão
Adotar **Clean Architecture** com **Domain-Driven Design (DDD)** dividindo o backend em 4 camadas:
1. **Domain**: Entidades, Value Objects, regras de negócio
2. **Application**: Use Cases, Ports (interfaces de repositório)
3. **Infrastructure**: Prisma ORM, implementações de repositório
4. **Presentation**: Fastify routes, controllers, DTOs, validators

### Consequências
- ✅ Separação clara de responsabilidades
- ✅ Fácil testar use cases mocking repositórios
- ✅ Domínio isolado de framework/biblioteca
- ❌ Maior número de arquivos/boilerplate
- ❌ Curva de aprendizado inicial

---

## ADR-002: Fastify como Framework HTTP

### Contexto
Necessitamos de um framework HTTP rápido, com bom suporte a TypeScript e plugins oficiais para Swagger, CORS e validação.

### Decisão
Utilizar **Fastify** em vez de Express ou NestJS.

### Consequências
- ✅ Performance superior ao Express (2x-3x mais rápido)
- ✅ Plugin nativo para Swagger (@fastify/swagger)
- ✅ Schema-based serialization (mais rápido que JSON.stringify)
- ✅ TypeScript-first (tipagem forte)
- ❌ Ecossistema menor que Express
- ❌ Menos recursos educacionais disponíveis

---

## ADR-003: Zustand para Gerenciamento de Estado

### Contexto
O frontend React precisa de uma solução de estado global simples, tipada e sem boilerplate excessivo.

### Opções Consideradas
- Redux Toolkit (muito boilerplate para este escopo)
- Context API (performance ruim para múltiplos estados)
- Jotai (bom, mas ecossistema menor)

### Decisão
Utilizar **Zustand** com stores separadas por domínio (categoryStore, expenseStore, revenueStore, dashboardStore).

### Consequências
- ✅ Mínimo boilerplate
- ✅ Tipo seguro com TypeScript
- ✅ Stores independentes (sem provider)
- ✅ Middleware para persistência (localStorage) se necessário
- ❌ Sem suporte nativo a side effects (resolved com useEffect + services)

---

## ADR-004: Prisma ORM com Neon (PostgreSQL Serverless)

### Contexto
O banco de dados precisa ser serverless (Neon) e o ORM deve suportar migrações, type safety e queries performáticas.

### Decisão
Utilizar **Prisma ORM 5+** conectado ao **Neon** (PostgreSQL serverless).

### Consequências
- ✅ Type-safe queries (Prisma Client gerado)
- ✅ Migrations versionadas
- ✅ Suporte nativo a PostgreSQL (Neon)
- ✅ Pool de conexões serverless
- ❌ Prisma não suporta Stored Procedures
- ❌ Migrations requerem conexão com o banco

---

## ADR-005: Zod para Validação Compartilhada

### Contexto
Precisamos validar dados no backend (Zod com Fastify) e idealmente reutilizar os mesmos schemas no frontend.

### Decisão
Utilizar **Zod** para validação em ambas as pontas. Os schemas Zod são definidos em pacote compartilhado ou duplicados de forma consistente.

### Consequências
- ✅ Validação declarativa e type-safe
- ✅ Inferência de tipos TypeScript a partir do schema
- ✅ Pode ser usado no frontend e backend
- ❌ Schemas precisam ser mantidos sincronizados (se não houver pacote shared)
- ❌ Performance de validação é inferior a Joi (mas suficiente)

---

## ADR-006: Zod Validators como Plugin Fastify

### Contexto
Precisamos integrar a validação Zod com o Fastify de forma fluente.

### Decisão
Usar **@fastify/type-provider-zod** ou a abordagem manual de validar no controller com `zod.parse()`.

### Consequências
- ✅ Integração direta com o esquema de serialização do Fastify
- ✅ Erros de validação formatados automaticamente
- ✅ Tipos inferidos para request/response
- ❌ Dependência adicional

---

## ADR-007: Rich Text com TipTap

### Contexto
Observações de categorias e transações suportam rich text (negrito, itálico, listas, etc.).

### Decisão
Utilizar **TipTap** (baseado em ProseMirror) como editor rich text no frontend.

### Consequências
- ✅ Framework-agnostic, fácil integrar com React
- ✅ Extensível (plugins para formatação adicional)
- ✅ Saída HTML limpa
- ❌ Bundle size maior (~50kb gzip)
- ❌ Complexidade adicional no formulário

---

## ADR-008: Deploy no Render

### Contexto
O backend precisa ser hospedado em serviço cloud com suporte a Node.js e deploy contínuo a partir do GitHub.

### Decisão
Utilizar **Render** (Web Service) para o backend.

### Consequências
- ✅ Deploy automático a partir do GitHub
- ✅ SSL/TLS automático
- ✅ Suporte a Node.js nativo
- ✅ Plano gratuito disponível
- ❌ Cold start em plano gratuito (>= 15min inatividade)
- ❌ Menos regiões que AWS/GCP
