# Wireframes - Finances SaaS

## Estrutura de Navegação

```
[App Shell]
├── Sidebar/Nav Inferior
│   ├── Dashboard (ícone: grid)
│   ├── Despesas Avulsas (ícone: tag)
│   ├── Despesas Recorrentes (ícone: refresh)
│   ├── Receitas Avulsas (ícone: dollar-sign)
│   ├── Receitas Recorrentes (ícone: repeat)
│   └── Categorias (ícone: folder)
└── [Content Area]
    └── Conteúdo da página ativa
```

---

## Wireframe 1: Dashboard

```
┌─────────────────────────────────────────────┐
│ [Logo] Finances                    [Perfil] │
├─────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│ │Desp.Avulsas│ │Desp.Recor.│ │  Últimos    │ │
│ │  R$ 2.450 │ │ R$ 3.200 │ │  Gastos     │ │
│ │  vs mês   │ │  vs mês  │ ├──────────────┤ │
│ │  passado  │ │  passado │ │ Supermercado │ │
│ └──────────┘ └──────────┘ │  R$ 350,00   │ │
│ ┌────────────────────────┐ │  Alimentação │ │
│ │  Gráfico: Gastos por   │ ├──────────────┤ │
│ │  Categoria (pizza/bar) │ │ Aluguel     │ │
│ │                        │ │  R$ 1.500   │ │
│ └────────────────────────┘ │  Moradia    │ │
│                            ├──────────────┤ │
│                            │ Uber        │ │
│                            │  R$ 45,00   │ │
│                            │  Transporte │ │
│                            └──────────────┘ │
└─────────────────────────────────────────────┘
```

**Elementos:**
- 3 cards de indicadores no topo (side-by-side no desktop, stack no mobile)
- Gráfico de gastos por categoria (pizza ou barra horizontal)
- Lista dos últimos 10 gastos com scroll
- Filtro de período (mês corrente / personalizado)

---

## Wireframe 2: Listagem de Transações (Despesas Avulsas)

```
┌─────────────────────────────────────────────┐
│ [←] Despesas Avulsas           [+ Novo]     │
├─────────────────────────────────────────────┤
│ Total: R$ 2.450,00                          │
├─────────────────────────────────────────────┤
│ [🔍 Buscar...]                    [Filtrar] │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Supermercado          R$ 350,00  ✏️ 🗑️ │ │
│ │ Alimentação · 02/06/2026               │ │
│ ├─────────────────────────────────────────┤ │
│ │ Farmácia              R$ 120,00  ✏️ 🗑️ │ │
│ │ Saúde · 01/06/2026                     │ │
│ ├─────────────────────────────────────────┤ │
│ │ Uber                  R$ 45,00   ✏️ 🗑️ │ │
│ │ Transporte · 31/05/2026                │ │
│ └─────────────────────────────────────────┘ │
│                                        1-3 │
│                                    [<] [>] │
└─────────────────────────────────────────────┘
```

**Elementos:**
- Header com título e botão "Novo"
- Total em destaque abaixo do header
- Barra de busca com filtro por período/categoria
- Lista com cards: nome, valor, categoria, data, ações (editar/excluir)
- Paginação no rodapé

---

## Wireframe 3: Formulário de Transação (Novo/Editar)

```
┌─────────────────────────────────────────────┐
│ [←] Nova Despesa Avulsa          [Salvar]  │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Nome *                                  │ │
│ │ [________________________]              │ │
│ │                                          │ │
│ │ Preço *                                 │ │
│ │ [R$ ___________]                        │ │
│ │                                          │ │
│ │ Data *                                  │ │
│ │ [02/06/2026        📅]                  │ │
│ │                                          │ │
│ │ Categoria *                             │ │
│ │ [Alimentação                       ▼]   │ │
│ │                                          │ │
│ │ Observações                             │ │
│ │ ┌──────────────────────────────────────┐│ │
│ │ │ B                                       ││ │
│ │ │ I   U   • Lista                        ││ │
│ │ │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┐│ │
│ │ │                                        ││ │
│ │ │ Compras do mês:                        ││ │
│ │ │ - Arroz                              ││ │
│ │ │ - Feijão                             ││ │
│ │ └────────────────────────────────────────││ │
│ │                                          │
│ └─────────────────────────────────────────┘ │
│ * Campos obrigatórios                       │
└─────────────────────────────────────────────┘
```

**Elementos:**
- Formulário com campos obrigatórios sinalizados
- Input de data com datepicker
- Select de categoria com busca
- Editor rich text para observações (negrito, itálico, sublinhado, lista)
- Botão salvar no header
- Validação inline nos campos

---

## Wireframe 4: Categorias

```
┌─────────────────────────────────────────────┐
│ [←] Categorias                 [+ Nova]   │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Alimentação          Orçamento: R$ 800 │ │
│ │ ████████████░░░░  62% usado            │ │
│ │ 📝 Compras mensais                     │ │
│ │                              ✏️ 🗑️     │ │
│ ├─────────────────────────────────────────┤ │
│ │ Transporte           Orçamento: R$ 300 │ │
│ │ ███████░░░░░░░░  40% usado             │ │
│ │ 📝 Uber, gasolina, manutenção          │ │
│ │                              ✏️ 🗑️     │ │
│ ├─────────────────────────────────────────┤ │
│ │ Salário              Orçamento: R$ 0   │ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Sem orçamento       │ │
│ │ 📝 Receita principal                    │ │
│ │                              ✏️ 🗑️     │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Elementos:**
- Cards de categoria com barra de progresso do orçamento
- Cor da barra muda conforme percentual (verde < 70%, amarelo 70-90%, vermelho > 90%)
- Observações em rich text renderizadas
- Ações de editar e excluir

---

## Wireframe 5: Menu de Navegação Mobile (Bottom Nav)

```
┌─────────────────────────────────────────────┐
│                                             │
│              [Content Area]                 │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│  [🏠]  [💸]  [🔄]  [💰]  [🔁]  [📁]     │
│ Dash  Desp  Desp  Rec   Rec   Categ   │
│       Avul  Rec   Avul  Rec           │
└─────────────────────────────────────────────┘
```

**Mobile-First Considerações:**
- Bottom navigation com 6 ícones (rolável ou compactado em "Mais")
- Formulários em tela cheia (modal full-screen)
- Cards ocupam 100% da largura
- Gestos de swipe para ações rápidas
