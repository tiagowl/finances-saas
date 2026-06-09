# Relatório de Usabilidade - Finances SaaS

## Cenários de Teste

### Cenário 1: Primeiro Acesso
**Tarefa:** O usuário acessa o sistema pela primeira vez e cadastra uma despesa.

| Etapa | Ação Esperada | Critério de Sucesso |
|-------|---------------|-------------------|
| 1 | Criar categoria "Alimentação" | Categoria criada em < 30s |
| 2 | Criar despesa avulsa "Supermercado - R$ 200" | Despesa criada em < 45s |
| 3 | Verificar despesa na listagem | Despesa aparece na lista |
| 4 | Verificar total na página | Total exibe R$ 200,00 |

**Métrica:** Tempo total < 2 minutos para completar o fluxo completo.

---

### Cenário 2: Gerenciamento de Múltiplas Transações
**Tarefa:** Usuário cadastra 5 despesas e 3 receitas.

| Etapa | Ação Esperada | Critério de Sucesso |
|-------|---------------|-------------------|
| 1 | Cadastrar 3 despesas avulsas | < 30s cada |
| 2 | Cadastrar 2 despesas recorrentes | < 25s cada |
| 3 | Cadastrar 2 receitas avulsas | < 30s cada |
| 4 | Cadastrar 1 receita recorrente | < 25s |
| 5 | Verificar totais nas páginas | Valores consistentes |

**Métrica:** Formulário preenchido em média < 30s por transação.

---

### Cenário 3: Consulta e Análise
**Tarefa:** Usuário acessa o dashboard para verificar situação financeira.

| Etapa | Ação Esperada | Critério de Sucesso |
|-------|---------------|-------------------|
| 1 | Acessar dashboard | Carregar em < 2s |
| 2 | Identificar total de despesas | Visualização imediata nos cards |
| 3 | Ver últimos gastos | Lista visível sem scroll |
| 4 | Filtrar por período | Filtro aplicado em < 1s |

**Métrica:** Dashboard funcional e informativo em < 3s.

---

### Cenário 4: Correção de Lançamento
**Tarefa:** Usuário percebe erro em uma despesa e precisa editá-la.

| Etapa | Ação Esperada | Critério de Sucesso |
|-------|---------------|-------------------|
| 1 | Localizar despesa na listagem | Encontrar em < 10s (busca) |
| 2 | Clicar em editar | Formulário pré-preenchido |
| 3 | Alterar valor de R$ 200 para R$ 180 | Campo editável |
| 4 | Salvar | Confirmação visual |
| 5 | Ver total atualizado | Total reflete alteração |

**Métrica:** Fluxo completo de edição em < 45s.

---

## Métricas de Usabilidade

| Métrica | Meta | Método de Medição |
|---------|------|-------------------|
| **Taxa de Sucesso** | > 95% | Proporção de tarefas completadas sem ajuda |
| **Tempo de Tarefa** | < 30s por transação | Tempo médio para cadastrar nova transação |
| **Taxa de Erro** | < 5% | Proporção de submissões com erro de validação |
| **Satisfação (SUS)** | > 80 | System Usability Scale (pós-teste) |
| **NPS** | > 50 | "Recomendaria para um amigo?" (0-10) |
| **Cliques até o objetivo** | < 3 | Número médio de cliques para ação principal |

---

## Problemas Potenciais de Usabilidade

| # | Problema | Severidade | Impacto | Solução Proposta |
|---|----------|------------|---------|------------------|
| P01 | Usuário não sabe o que é "despesa avulsa" vs "recorrente" | Média | Alto | Adicionar tooltips explicativos e exemplos |
| P02 | Campos rich text podem confundir usuários não técnicos | Baixa | Médio | Manter toolbar simples e visível |
| P03 | Muitas categorias na listagem dificultam encontrar uma específica | Média | Alto | Adicionar busca no select de categorias |
| P04 | Usuário pode esquecer de preencher campos obrigatórios | Alta | Alto | Validação inline em tempo real + destaque visual |
| P05 | Mobile: bottom nav com 6 itens pode ficar apertado | Média | Médio | Agrupar em 5 + "Mais" ou usar scroll horizontal |
| P06 | Usuário pode excluir categoria em uso | Alta | Alto | Bloquear exclusão e explicar o motivo |
| P07 | Data futura em despesa não deve ser permitida | Média | Baixo | Alertar ao usuário com mensagem clara |

---

## Recomendações de Melhoria

### Prioridade Alta
1. **Onboarding inicial**: Tutorial interativo de 3 passos no primeiro acesso
2. **Validação inline**: Validar campos conforme o usuário digita (não só no submit)
3. **Confirmação de exclusão**: Sempre perguntar "Tem certeza?" antes de excluir
4. **Feedback de ação**: Toast/snackbar para toda operação (sucesso/erro)

### Prioridade Média
5. **Busca global**: Campo de busca que pesquisa em todas as entidades
6. **Auto-categorização**: Baseado no histórico, sugerir categoria ao digitar o nome
7. **Modo escuro**: Opção de tema dark para uso noturno
8. **Atalhos de teclado**: Ctrl+N para novo, Ctrl+S para salvar

### Prioridade Baixa
9. **Exportar dados**: CSV/PDF das listagens
10. **Metas financeiras**: Estabelecer metas mensais por categoria
11. **Histórico de alterações**: Log de alterações em cada transação
