# Análise de Requisitos - Finances SaaS

## Objetivos de Negócio

- Fornecer um sistema completo de controle financeiro pessoal/empresarial
- Permitir o gerenciamento de receitas e despesas (avulsas e recorrentes)
- Oferecer visibilidade financeira através de dashboard com indicadores-chave
- Categorizar transações para análise de gastos por categoria

## Usuários-Alvo

| Persona | Descrição | Necessidades |
|---------|-----------|--------------|
| **Usuário Financeiro Pessoa Física** | Indivíduo que deseja controlar finanças pessoais | Gerenciar gastos, receitas, visualizar dashboards |
| **Pequeno Empresário** | Dono de pequeno negócio | Controlar fluxo de caixa, despesas operacionais e receitas |
| **Gestor Financeiro** | Profissional responsável por finanças de uma organização | Relatórios detalhados, categorização, visão consolidada |

## Funcionalidades Principais

| ID | Funcionalidade | Descrição |
|----|---------------|-----------|
| F01 | Dashboard | Estatísticas de despesas avulsas, recorrentes e últimos gastos |
| F02 | CRUD Despesas Avulsas | Nome, observações (rich text), preço, data, categoria |
| F03 | CRUD Despesas Recorrentes | Nome, preço, observações (rich text), categoria |
| F04 | CRUD Receitas Avulsas | Nome, preço, observações (rich text), data, categoria |
| F05 | CRUD Receitas Recorrentes | Nome, preço, observações (rich text), categoria |
| F06 | CRUD Categorias | Nome, observações (rich text), orçamento máximo |
| F07 | Totais por Página | Exibição do total dos preços nas listagens |

## Restrições e Limitações

### Tecnológicas
- **Frontend**: React + Tailwind CSS + Zustand
- **Backend**: Node.js + Fastify + TypeScript + Prisma ORM + Zod + Swagger
- **Arquitetura**: Clean Architecture + DDD + Repository Pattern
- **Banco de Dados**: Neon (PostgreSQL Serverless)
- **Hospedagem Backend**: Render

### De Negócio
- Despesas avulsas possuem data específica; recorrentes não
- Receitas avulsas possuem data específica; recorrentes não
- Categorias possuem orçamento máximo para controle
- Rich text é suportado em observações das entidades
