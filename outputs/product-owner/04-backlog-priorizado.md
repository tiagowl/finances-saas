# Backlog Priorizado - Finances SaaS

## Priorização: Método MoSCoW + Valor de Negócio vs Esforço

### MVP (Must Have) - Sprint 1

| Prioridade | ID | User Story | Valor Negócio | Esforço | Dependências |
|------------|----|-----------|---------------|---------|--------------|
| P0 | US22 | Cadastrar Categoria | Alto | Baixo | Nenhuma |
| P0 | US23 | Listar Categorias | Alto | Baixo | Nenhuma |
| P0 | US24 | Editar Categoria | Alto | Baixo | US22 |
| P0 | US25 | Excluir Categoria | Alto | Baixo | US23 |
| P0 | US02 | Cadastrar Despesa Avulsa | Alto | Médio | US22 |
| P0 | US03 | Listar Despesas Avulsas | Alto | Baixo | US02 |
| P0 | US04 | Editar Despesa Avulsa | Alto | Médio | US03 |
| P0 | US05 | Excluir Despesa Avulsa | Alto | Baixo | US03 |
| P0 | US07 | Cadastrar Despesa Recorrente | Alto | Médio | US22 |
| P0 | US08 | Listar Despesas Recorrentes | Alto | Baixo | US07 |
| P0 | US09 | Editar Despesa Recorrente | Alto | Médio | US08 |
| P0 | US10 | Excluir Despesa Recorrente | Alto | Baixo | US08 |
| P0 | US12 | Cadastrar Receita Avulsa | Alto | Médio | US22 |
| P0 | US13 | Listar Receitas Avulsas | Alto | Baixo | US12 |
| P0 | US14 | Editar Receita Avulsa | Alto | Médio | US13 |
| P0 | US15 | Excluir Receita Avulsa | Alto | Baixo | US13 |
| P0 | US17 | Cadastrar Receita Recorrente | Alto | Médio | US22 |
| P0 | US18 | Listar Receitas Recorrentes | Alto | Baixo | US17 |
| P0 | US19 | Editar Receita Recorrente | Alto | Médio | US18 |
| P0 | US20 | Excluir Receita Recorrente | Alto | Baixo | US18 |

### Should Have - Sprint 2

| Prioridade | ID | User Story | Valor Negócio | Esforço | Dependências |
|------------|----|-----------|---------------|---------|--------------|
| P1 | US06 | Total Despesas Avulsas | Médio | Baixo | US03 |
| P1 | US11 | Total Despesas Recorrentes | Médio | Baixo | US08 |
| P1 | US16 | Total Receitas Avulsas | Médio | Baixo | US13 |
| P1 | US21 | Total Receitas Recorrentes | Médio | Baixo | US18 |

### Could Have - Sprint 3

| Prioridade | ID | User Story | Valor Negócio | Esforço | Dependências |
|------------|----|-----------|---------------|---------|--------------|
| P2 | US01 | Dashboard Financeiro | Alto | Alto | US06, US11, US16, US21 |

## Estimativa de Esforço

| Nível | Descrição |
|-------|-----------|
| **Baixo** | Componente simples, sem dependências externas |
| **Médio** | CRUD completo, require validações e integração com dados |
| **Alto** | Múltiplos componentes, integração de dados, lógica complexa |

## Roadmap de Sprints

```
Sprint 1 (MVP) - CRUDs Base (2 semanas)
├── Categorias (CRUD completo)
├── Despesas Avulsas (CRUD completo)
├── Despesas Recorrentes (CRUD completo)
├── Receitas Avulsas (CRUD completo)
└── Receitas Recorrentes (CRUD completo)

Sprint 2 - Indicadores (1 semana)
├── Total nas páginas de listagem (4 páginas)
└── Ajustes finos no CRUD

Sprint 3 - Dashboard (1 semana)
├── Dashboard consolidado
├── Estatísticas e indicadores
└── Últimos gastos
```

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Rich text nas observações | Média | Médio | Usar biblioteca testada (ex: TipTap, Quill) |
| Clean Architecture no backend | Média | Alto | Definir camadas claras e separar responsabilidades |
| Integração com Neon (serverless) | Baixa | Médio | Testar pool de conexões no Render |
| Performance dashboard com muitos dados | Baixa | Alto | Implementar agregações no banco com Prisma |
