# Design System - Finances SaaS

## 1. Princípios de Design

| Princípio | Descrição |
|-----------|-----------|
| **Clareza** | Cada elemento tem um propósito claro. Sem ruído visual |
| **Eficiência** | Mínimo de passos para completar tarefas frequentes |
| **Consistência** | Padrões repetíveis em toda interface |
| **Acessibilidade** | WCAG 2.1 AA como padrão mínimo |
| **Feedback** | Toda ação do usuário tem resposta visual imediata |

---

## 2. Paleta de Cores

### Cores Primárias
```
Primary:    #0F766E  (Teal 700)
Primary-L:  #14B8A6  (Teal 500)   - Hover/Active
Primary-D:  #115E59  (Teal 800)   - Pressed

Secondary:  #475569  (Slate 600)
Secondary-L: #64748B (Slate 500)
```

### Cores Semânticas
```
Success:    #16A34A  (Green 600)
Warning:    #F59E0B  (Amber 500)
Error:      #DC2626  (Red 600)
Info:       #2563EB  (Blue 600)
```

### Neutros
```
Background: #F8FAFC  (Slate 50)
Surface:    #FFFFFF  (White)
Border:     #E2E8F0  (Slate 200)
Text:       #0F172A  (Slate 900)
Text-Muted: #64748B  (Slate 500)
```

---

## 3. Tipografia

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Escala Tipográfica
| Nível | Mobile | Desktop | Weight | Uso |
|-------|--------|---------|--------|-----|
| h1 | 24px | 32px | 700 (Bold) | Page title |
| h2 | 20px | 24px | 600 (Semibold) | Section title |
| h3 | 16px | 20px | 600 (Semibold) | Card title |
| body | 14px | 16px | 400 (Regular) | Body text |
| body-sm | 12px | 14px | 400 | Caption, metadata |
| label | 12px | 14px | 500 (Medium) | Form labels |
| overline | 10px | 12px | 600 | Small labels |

---

## 4. Componentes de UI

### 4.1 Cards
```
┌─────────────────────────────────────────┐
│                                         │
│  Título do Card                         │
│  Conteúdo                               │
│                                         │
└─────────────────────────────────────────┘
```
- **Padding**: 16px (mobile), 24px (desktop)
- **Border radius**: 8px (rounded-lg)
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Hover**: Elevação para 0 4px 6px rgba(0,0,0,0.1)

### 4.2 Botões

| Tipo | Estilo | Uso |
|------|--------|-----|
| **Primary** | `bg-teal-700 text-white hover:bg-teal-500` | Ação principal |
| **Secondary** | `bg-white border border-slate-300` | Ação secundária |
| **Ghost** | `bg-transparent hover:bg-slate-100` | Ação terciária |
| **Danger** | `bg-red-600 text-white` | Exclusão |
| **Icon** | `p-2 rounded-full` | Ações de linha |

### 4.3 Formulários

```
Input:
┌─────────────────────────────────────────┐
│  Label *                                │
│  ┌─────────────────────────────────────┐│
│  │ Valor                           ││
│  └─────────────────────────────────────┘│
│  Mensagem de erro                       │
└─────────────────────────────────────────┘
```

- **Input height**: 40px
- **Border**: 1.5px solid `#E2E8F0`
- **Focus**: ring 2px `#0F766E` + border `#0F766E`
- **Error**: border `#DC2626` + error text abaixo
- **Disabled**: opacity 50%, cursor not-allowed

### 4.4 Modais

```
┌─────────────────────────────────────────┐
│  [Overlay: bg-black opacity-50]         │
│  ┌─────────────────────────────────────┐│
│  │  Título                    [✕]     ││
│  ├─────────────────────────────────────┤│
│  │  Conteúdo                           ││
│  │                                     ││
│  ├─────────────────────────────────────┤│
│  │  [Cancelar]              [Confirmar]││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

- **Overlay**: 50% opacity black
- **Content**: max-w-md, padding 24px
- **Animation**: scale + fade (200ms)

### 4.5 Toast/Snackbar

```
┌──────────────────────────────┐
│ ✅ Registro salvo com sucesso│
└──────────────────────────────┘
```

- **Position**: Top-right (desktop), bottom-center (mobile)
- **Auto-dismiss**: 3 segundos
- **Icon**: Check (success), X (error), Info (info)

### 4.6 Barra de Progresso (Orçamento)

```
Categoria: Alimentação (Orçamento: R$ 800)
▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱  62% usado (R$ 496)
```

- **Altura**: 8px
- **Border radius**: 4px (rounded-full)
- **Cores**: `#16A34A` (< 70%), `#F59E0B` (70-90%), `#DC2626` (> 90%)
- **Label**: Percentual + valor usado / orçamento

---

## 5. Espaçamento e Grid

### Grid
```css
/* Desktop: 12-column grid, gap 24px */
/* Tablet: 8-column grid, gap 16px */
/* Mobile: 4-column grid, gap 16px */
```

### Spacing Scale
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
2xl:  48px
3xl:  64px
```

### Breakpoints
```
Mobile:  0 - 639px
Tablet:  640px - 1023px
Desktop: 1024px+
```

---

## 6. Ícones

- **Biblioteca**: Lucide React (consistente com Tailwind)
- **Tamanhos**: 16px (inline), 20px (botões), 24px (navegação)
- **Estilo**: Outline, stroke-width 1.5

| Contexto | Ícone |
|-----------|-------|
| Dashboard | `LayoutDashboard` |
| Despesas Avulsas | `Tag` |
| Despesas Recorrentes | `RefreshCw` |
| Receitas Avulsas | `DollarSign` |
| Receitas Recorrentes | `Repeat` |
| Categorias | `Folder` |
| Novo | `Plus` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Buscar | `Search` |
| Voltar | `ArrowLeft` |

---

## 7. Acessibilidade

| Requisito | Implementação |
|-----------|---------------|
| **Contraste** | Mínimo 4.5:1 para texto normal (AA) |
| **Foco visível** | Outline 2px #0F766E em todos elementos interativos |
| **Labels** | Todo input tem label associada (htmlFor) |
| **aria-labels** | Botões de ícone têm aria-label descritivo |
| **Navegação teclado** | Tab order lógico, Skip to content link |
| **Roles** | landmarks: header, nav, main, complementary |
| **Reduced motion** | `prefers-reduced-motion` para desabilitar animações |
| **Screen reader** | Anúncio de toast com role="status" aria-live="polite" |
