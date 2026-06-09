# Guia de Desenvolvimento - Finances SaaS

## 1. Convenções de Código

### 1.1 Nomenclatura

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos React | PascalCase | `Dashboard.tsx`, `ExpenseCard.tsx` |
| Arquivos TS/TSX | camelCase | `api.ts`, `categoryStore.ts` |
| Componentes | PascalCase | `<ExpenseList />`, `<BudgetBar />` |
| Funções | camelCase | `createCategory()`, `listExpenses()` |
| Interfaces | PascalCase prefixo I | `ICategoryRepository` |
| Types | PascalCase | `CreateCategoryDTO` |
| Enum | PascalCase | `TransactionType` |
| Variáveis | camelCase | `totalExpenses` |
| Constantes | UPPER_SNAKE | `MAX_BUDGET_WARNING` |

### 1.2 Estrutura de Arquivos

```
src/
├── domain/
│   └── entities/
│       └── Category.ts          # Entidade pura (sem dependências externas)
│
├── application/
│   ├── use-cases/
│   │   └── category/
│   │       ├── CreateCategoryUseCase.ts
│   │       ├── ListCategoriesUseCase.ts
│   │       ├── UpdateCategoryUseCase.ts
│   │       └── DeleteCategoryUseCase.ts
│   └── ports/
│       └── repositories/
│           └── ICategoryRepository.ts
│
├── infrastructure/
│   └── database/
│       └── repositories/
│           └── PrismaCategoryRepository.ts
│
└── presentation/
    ├── routes/
    │   └── category.routes.ts
    ├── controllers/
    │   └── category.controller.ts
    ├── dtos/
    │   └── category.dto.ts
    └── validators/
        └── category.validator.ts
```

### 1.3 Padrões de Design

| Padrão | Onde Usar |
|--------|-----------|
| **Repository Pattern** | Camada de infraestrutura (Prisma) |
| **Use Case** | Camada de aplicação (caso de uso por ação) |
| **DTO** | Transferência de dados entre camadas |
| **Dependency Injection** | Use cases recebem repositórios via constructor |
| **Factory** | Criação de entidades complexas (quando necessário) |
| **Value Object** | Objetos imutáveis (Price, RichText) |

---

## 2. Boas Práticas

### 2.1 TypeScript

```typescript
// ✅ Preferir interfaces para objetos
interface CreateCategoryDTO {
  name: string;
  notes?: string;
  maxBudget?: number;
}

// ✅ Usar readonly para evitar mutação
interface CategoryProps {
  readonly id: string;
  readonly name: string;
}

// ❌ Evitar any
const data: any = {}; // ❌
const data: unknown = {}; // ✅ depois refine com typeof/assertion

// ✅ Usar satisfies para checagem sem narrowing
const config = {
  api: 'https://...',
  timeout: 5000,
} satisfies Record<string, unknown>;
```

### 2.2 Entidades de Domínio

```typescript
// ✅ Entidade pura, sem dependências de framework
export class Category {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _notes: RichText | null,
    private _maxBudget: number | null,
  ) {}

  static create(props: CreateCategoryProps): Category {
    // Validações de domínio
    if (!props.name || props.name.length < 2) {
      throw new DomainError('Name must have at least 2 characters');
    }
    return new Category(
      props.id ?? crypto.randomUUID(),
      props.name,
      props.notes ?? null,
      props.maxBudget ?? null,
    );
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get isBudgetExceeded(currentSpending: number): boolean {
    return this._maxBudget !== null && currentSpending > this._maxBudget;
  }
}
```

### 2.3 Use Cases

```typescript
// ✅ Use case com injeção de dependência
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDTO): Promise<Category> {
    const existing = await this.categoryRepo.findByName(dto.name);
    if (existing) {
      throw new ConflictError('Category already exists');
    }

    const category = Category.create({
      name: dto.name,
      notes: dto.notes,
      maxBudget: dto.maxBudget,
    });

    return this.categoryRepo.save(category);
  }
}
```

### 2.4 Repositórios

```typescript
// ✅ Port (interface) na camada de application
export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}

// ✅ Implementação na camada de infraestrutura
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Category | null> {
    const raw = await this.prisma.category.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  private toDomain(raw: PrismaCategory): Category {
    return Category.create({
      id: raw.id,
      name: raw.name,
      notes: raw.notes,
      maxBudget: raw.maxBudget?.toNumber(),
    });
  }
}
```

---

## 3. Commands de Setup

```powershell
# Inicializar projeto
npm init -y

# Instalar dependências do backend
npm install fastify @fastify/swagger @fastify/cors zod prisma @prisma/client
npm install -D typescript tsx @types/node

# Instalar dependências do frontend
npm create vite@latest frontend -- --template react-ts
npm install zustand react-router-dom @tiptap/react @tiptap/starter-kit lucide-react date-fns
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Inicializar Prisma
npx prisma init
npx prisma db push
```

---

## 4. Qualidade e Testes

| Ferramenta | Finalidade | Comando |
|------------|------------|---------|
| **Vitest** | Testes unitários (backend + frontend) | `npx vitest` |
| **Prisma Studio** | Visualização do banco | `npx prisma studio` |
| **TypeScript** | Type checking | `npx tsc --noEmit` |
| **ESLint** | Linting | `npx eslint src/` |
| **Prettier** | Formatação | `npx prettier --check src/` |

### Estrutura de Testes

```
src/
├── domain/
│   └── entities/
│       └── Category.spec.ts       # Testes de domínio
├── application/
│   └── use-cases/
│       └── category/
│           └── CreateCategoryUseCase.spec.ts  # Testes de use case
└── presentation/
    └── routes/
        └── category.routes.spec.ts  # Testes de integração (E2E)
```

---

## 5. Scripts do package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/infrastructure/server.ts",
    "build": "tsc",
    "start": "node dist/infrastructure/server.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```
