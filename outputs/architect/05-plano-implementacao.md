# Plano de Implementação - Finances SaaS

## Fase 1: Fundação (Sprint 1 - 2 semanas)

### Semana 1 - Setup e Categorias

| Dia | Atividade | Entregáveis |
|-----|-----------|-------------|
| 1-2 | Setup dos projetos (frontend + backend) | Projetos inicializados, configurados e rodando |
| 2-3 | Configuração do Prisma + Neon | Schema criado, migrations aplicadas |
| 2-4 | Entidade Category + CRUD backend | API de categorias funcional |
| 4-5 | Página de Categorias (frontend) | CRUD de categorias no frontend |

### Semana 2 - CRUDs de Transações

| Dia | Atividade | Entregáveis |
|-----|-----------|-------------|
| 6-7 | CRUD Despesas Avulsas (backend + frontend) | API + página funcional |
| 7-8 | CRUD Despesas Recorrentes (backend + frontend) | API + página funcional |
| 8-9 | CRUD Receitas Avulsas (backend + frontend) | API + página funcional |
| 9-10 | CRUD Receitas Recorrentes (backend + frontend) | API + página funcional |

---

## Fase 2: Indicadores (Sprint 2 - 1 semana)

| Dia | Atividade | Entregáveis |
|-----|-----------|-------------|
| 11 | Backend: rotas /total para cada entidade | Agregação de totais |
| 12 | Frontend: exibição de totais nas listagens | Total visível em cada página |
| 13 | Editor rich text (TipTap) | Componente funcional |
| 14 | Ajustes finos, validações, tratamento de erros | UX refinada |

---

## Fase 3: Dashboard (Sprint 3 - 1 semana)

| Dia | Atividade | Entregáveis |
|-----|-----------|-------------|
| 15 | Backend: rota /dashboard com agregações | API de dashboard |
| 16-17 | Frontend: cards de indicadores + gráficos | Dashboard visual |
| 18 | Filtro de período | Filtro funcional |
| 19 | Testes finais, deploy no Render | Sistema no ar |

---

## Matriz de Dependências

```
Categorias ─────────────────────────────────────┐
                                                 ▼
Despesas Avulsas ───► Totais Avulsas ─────────┐  │
Despesas Recorrentes ─► Totais Recorrentes ───┼──┤
Receitas Avulsas ────► Totais Avulsas ────────┼──┤
Receitas Recorrentes ─► Totais Recorrentes ───┼──┤
                                               ▼  ▼
                                        Dashboard
```

---

## Marcos (Milestones)

| Marco | Data | Critério |
|-------|------|----------|
| **M1** | Fim Sprint 1 | CRUD completo de categorias e todas as transações |
| **M2** | Fim Sprint 2 | Totais exibidos em todas as páginas de listagem |
| **M3** | Fim Sprint 3 | Dashboard funcional, sistema deployado no Render |
