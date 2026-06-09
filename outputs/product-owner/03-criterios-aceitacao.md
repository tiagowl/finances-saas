# Critérios de Aceitação - Finances SaaS

## US01 - Dashboard Financeiro

### Cenário de Sucesso
- Dado que existem despesas e receitas cadastradas
- Quando o usuário acessa o dashboard
- Então o sistema exibe o total de despesas avulsas, despesas recorrentes e os últimos 10 gastos

### Casos Extremos
- Quando não há despesas cadastradas, o dashboard deve exibir R$ 0,00 nos totais e "Nenhum gasto registrado" na lista
- Quando há mais de 10 gastos, exibir apenas os 10 mais recentes com opção "Ver todos"

### Validações
- Os totais devem ser calculados com base nos dados do banco
- A lista de últimos gastos deve estar ordenada por data decrescente

---

## US02 a US05 - CRUD Despesas Avulsas

### Cenário de Sucesso (Criação)
- Dado que o usuário preenche nome, observações, preço, data e categoria
- Quando o usuário confirma o cadastro
- Então a despesa avulsa é salva no banco de dados e exibida na listagem

### Cenário de Sucesso (Listagem)
- Dado que existem despesas avulsas cadastradas
- Quando o usuário acessa a página de despesas avulsas
- Então o sistema exibe a lista com todas as despesas e o total

### Cenário de Sucesso (Edição)
- Dado que uma despesa avulsa existe
- Quando o usuário altera seus dados e confirma
- Então os dados são atualizados no banco

### Casos Extremos
- Nome é obrigatório (mínimo 2 caracteres, máximo 200)
- Preço deve ser um valor numérico positivo
- Data não pode ser futura (alertar usuário)
- Categoria é obrigatória
- Observações rich text: suportar formatação básica (negrito, itálico, listas)

### Validações
- CRUD completo com feedback visual (toast/snackbar)
- Confirmação antes de excluir
- Paginação se houver mais de 20 registros
- Campo de busca por nome

---

## US07 a US11 - CRUD Despesas Recorrentes

### Cenário de Sucesso
- Dado que o usuário preenche nome, preço, observações e categoria
- Quando o usuário confirma o cadastro
- Então a despesa recorrente é salva (sem data específica)

### Casos Extremos
- Preço deve ser numérico positivo
- Nome obrigatório (2-200 caracteres)
- Categoria obrigatória
- Observações rich text opcional

### Validações
- Listagem com total exibido no topo da página
- Confirmação antes de excluir
- Edição preserva dados não alterados

---

## US12 a US16 - CRUD Receitas Avulsas

### Cenário de Sucesso
- Dado que o usuário preenche nome, preço, observações, data e categoria
- Quando o usuário confirma o cadastro
- Então a receita avulsa é salva

### Casos Extremos
- Preço deve ser numérico positivo
- Data não pode ser futura
- Categoria deve ser do tipo "receita" ou genérica

### Validações
- Total de receitas avulsas exibido na página de listagem
- CRUD completo com feedback

---

## US17 a US21 - CRUD Receitas Recorrentes

### Cenário de Sucesso
- Dado que o usuário preenche nome, preço, observações e categoria
- Quando o usuário confirma o cadastro
- Então a receita recorrente é salva

### Casos Extremos
- Preço numérico positivo
- Nome obrigatório

### Validações
- Total exibido na listagem
- CRUD completo com feedback

---

## US22 a US25 - CRUD Categorias

### Cenário de Sucesso
- Dado que o usuário preenche nome, observações e orçamento máximo
- Quando o usuário confirma
- Então a categoria é salva

### Casos Extremos
- Orçamento máximo é opcional (pode ser 0 ou null)
- Nome da categoria deve ser único
- Não permitir excluir categoria vinculada a receitas ou despesas (exibir mensagem)

### Validações
- Listagem de categorias com indicador visual de orçamento (ex: barra de progresso)
- Orçamento máximo deve ser numérico positivo quando preenchido
- Observações rich text opcional
