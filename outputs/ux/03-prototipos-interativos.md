# Protótipos Interativos - Finances SaaS

## Especificações de Interação

### 1. Navegação Global

| Interação | Comportamento |
|-----------|--------------|
| **Clique no item da sidebar/bottom nav** | Transição suave (fade + slide) para a página selecionada |
| **Indicador ativo** | Item selecionado fica destacado com cor primária e ícone preenchido |
| **Mobile: Bottom Nav** | 5 ícones principais + "Mais" para categorias |
| **Desktop: Sidebar** | Expandida com ícones + rótulos, modo retrátil para ícones apenas |

### 2. Dashboard

| Interação | Comportamento |
|-----------|--------------|
| **Card de indicador** | Ao clicar, navega para a listagem correspondente |
| **Gráfico de pizza** | Hover mostra valor e percentual da categoria. Ao clicar, filtra por aquela categoria |
| **Lista de últimos gastos** | Scroll infinito com loading skeleton. Ao clicar, abre modal de detalhes |
| **Filtro de período** | Dropdown com "Este mês", "Mês passado", "Últimos 3 meses", "Personalizado" |
| **Atualização** | Pull-to-refresh no mobile, botão "Atualizar" no desktop |

### 3. Listagens (CRUD)

| Interação | Comportamento |
|-----------|--------------|
| **Busca** | Campo de busca com debounce (300ms). Resultados filtrados em tempo real |
| **Filtro por categoria** | Dropdown com checkboxes. Múltiplas categorias simultâneas |
| **Ordenação** | Clique no header para ordenar por nome/preço/data |
| **Ações rápidas** | Ícones de editar/excluir no hover (desktop) ou sempre visíveis (mobile) |
| **Swipe (mobile)** | Swipe à esquerda revela ação de excluir, swipe à direita revela editar |
| **Paginação** | "Carregar mais" no mobile, paginação numerada no desktop |

### 4. Formulários

| Interação | Comportamento |
|-----------|--------------|
| **Validação inline** | Campo inválido mostra borda vermelha + mensagem de erro abaixo |
| **Auto-focus** | Primeiro campo do formulário recebe foco automaticamente |
| **Datepicker** | Calendário popup. Entrada manual de data também aceita |
| **Select de categoria** | Dropdown com busca. "Adicionar nova categoria" como última opção |
| **Rich text editor** | Toolbar com: B, I, U, lista ordenada/não ordenada |
| **Salvar** | Botão "Salvar" no header. Atalho: Ctrl+Enter |
| **Cancelar** | Botão "Voltar" ou clique fora do modal. Confirmação se houver dados não salvos |

### 5. Estados da Interface

#### 5.1 Estados de Listagem

```
[Estado Padrão]
┌─────────────────────────────────────────┐
│ Item 1                    R$ 100  ✏️ 🗑️ │
│ Item 2                    R$ 200  ✏️ 🗑️ │
│ Item 3                    R$ 300  ✏️ 🗑️ │
└─────────────────────────────────────────┘

[Estado Vazio]
┌─────────────────────────────────────────┐
│           📭 Nenhum registro            │
│    Clique em "+ Novo" para começar      │
└─────────────────────────────────────────┘

[Estado de Erro]
┌─────────────────────────────────────────┐
│        ⚠️ Erro ao carregar dados        │
│           [Tentar novamente]            │
└─────────────────────────────────────────┘

[Estado de Carregamento]
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### 5.2 Estados de Formulário

```
[Preenchimento Parcial]
┌─ Campo: ✅ Válido (check verde)        ─┐
┌─ Campo: ❌ Inválido (mensagem de erro)  ─┐
┌─ Campo: ⏳ Validando (spinner)          ─┐

[Sucesso]
Toast/Notificação: "Registro salvo com sucesso! ✅"

[Erro]
Toast/Notificação: "Erro ao salvar. Tente novamente. ⚠️"
```

### 6. Feedback Visual

| Ação | Feedback |
|------|----------|
| **Clique em botão** | Efeito ripple (material design) |
| **Salvar** | Botão mostra spinner e desabilita durante salvamento |
| **Excluir** | Modal de confirmação: "Tem certeza que deseja excluir?" |
| **Operação concluída** | Toast no canto superior direito (auto-dismiss 3s) |
| **Erro de rede** | Snackbar persistente até o usuário fechar |
| **Campo obrigatório** | Indicado com asterisco vermelho (*) |

### 7. Transições e Animações

| Transição | Tipo | Duração |
|-----------|------|---------|
| Navegação entre páginas | Fade + Slide (50px) | 200ms |
| Abertura de modal | Scale (0.95 → 1) + Fade | 200ms |
| Fechamento de modal | Scale (1 → 0.95) + Fade | 150ms |
| Toast notificação | Slide-in from right | 300ms |
| Hover em cards | Elevação (box-shadow) | 150ms |
| Skeleton loading | Pulse opacity | 1.5s loop |
