-- ============================================================
-- SEED SQL - Finances SaaS
-- Dados de teste para todas as tabelas
-- ============================================================

-- Limpar dados existentes (em ordem inversa das dependências)
DELETE FROM "RecurringRevenue";
DELETE FROM "OccasionalRevenue";
DELETE FROM "RecurringExpense";
DELETE FROM "OccasionalExpense";
DELETE FROM "Category";
DELETE FROM "User";

-- ============================================================
-- ADMIN USER
-- ============================================================
INSERT INTO "User" (id, name, email, "passwordHash", role, "createdAt", "updatedAt") VALUES
  ('00000000-0000-4000-a000-000000000001', 'Admin', 'admin@finances.com', '$2b$10$yjdr9ePimEGNUgg8OyFl8OJ8AqGslssXAKj70atkwClxAaojeG49O', 'admin', NOW(), NOW()),
  ('00000000-0000-4000-a000-000000000002', 'Usuário Teste', 'user@finances.com', '$2b$10$yjdr9ePimEGNUgg8OyFl8OJ8AqGslssXAKj70atkwClxAaojeG49O', 'user', NOW(), NOW());

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO "Category" (id, name, notes, "maxBudget", "userId", "createdAt", "updatedAt") VALUES
  ('c0010001-0001-4000-8000-000000000001', 'Alimentação', '<p>Gastos com <strong>alimentação</strong> em geral: supermercado, restaurantes, delivery.</p>', 800.00, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000002', 'Transporte', '<p>Transporte público, <em>combustível</em>, estacionamento e aplicativos.</p>', 300.00, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000003', 'Moradia', '<p>Aluguel, condomínio, <strong>contas de casa</strong> (água, luz, internet).</p>', 2000.00, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000004', 'Saúde', '<p>Plano de saúde, <em>consultas</em>, medicamentos e exames.</p>', 500.00, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000005', 'Educação', '<p>Cursos, <strong>faculdade</strong>, livros e materiais didáticos.</p>', 400.00, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000006', 'Lazer', '<p>Cinema, <em>streaming</em>, viagens e entretenimento.</p>', 300.00, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000007', 'Salário', '<p>Receita principal mensal.</p>', NULL, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000008', 'Freelance', '<p>Receitas de <strong>trabalhos avulsos</strong> e projetos extras.</p>', NULL, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-000000000009', 'Investimentos', '<p>Rendimentos de <em>investimentos</em>, dividendos e juros.</p>', NULL, '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('c0010001-0001-4000-8000-00000000000a', 'Outros', '<p>Gastos e receitas que não se enquadram nas outras categorias.</p>', NULL, '00000000-0000-4000-a000-000000000001', NOW(), NOW());

-- ============================================================
-- OCCASIONAL EXPENSES (Despesas Avulsas)
-- ============================================================
INSERT INTO "OccasionalExpense" (id, name, notes, price, date, "categoryId", "userId", "createdAt", "updatedAt") VALUES
  ('e0010001-0001-4000-8000-000000000001', 'Supermercado Mês', '<p>Compras do mês no <strong>Atacadão</strong>.</p>', 450.00, '2026-06-01 10:30:00', 'c0010001-0001-4000-8000-000000000001', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000002', 'Jantar no Restaurante', '<p>Jantar de <em>aniversário</em> no Outback.</p>', 180.00, '2026-06-05 20:00:00', 'c0010001-0001-4000-8000-000000000001', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000003', 'Uber para o trabalho', '<p>Corrida de ida para o escritório.</p>', 25.00, '2026-06-03 08:15:00', 'c0010001-0001-4000-8000-000000000002', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000004', 'Gasolina', '<p>Abastecimento completo no <strong>Posto Shell</strong>.</p>', 220.00, '2026-06-02 17:30:00', 'c0010001-0001-4000-8000-000000000002', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000005', 'Farmácia', '<p>Compra de <em>medicamentos</em> para tratamento mensal.</p>', 95.00, '2026-06-04 15:00:00', 'c0010001-0001-4000-8000-000000000004', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000006', 'Curso Online', '<p>Assinatura anual da <strong>Alura</strong>.</p>', 180.00, '2026-06-01 09:00:00', 'c0010001-0001-4000-8000-000000000005', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000007', 'Ingressos Cinema', '<p>Filme: <em>Vingadores 5</em> - 2 ingressos.</p>', 60.00, '2026-06-06 19:30:00', 'c0010001-0001-4000-8000-000000000006', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000008', 'Livro Técnico', '<p><strong>Clean Code</strong> - Robert C. Martin.</p>', 89.90, '2026-05-28 14:00:00', 'c0010001-0001-4000-8000-000000000005', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-000000000009', 'Estacionamento', '<p>Estacionamento rotativo no centro.</p>', 15.00, '2026-05-30 10:00:00', 'c0010001-0001-4000-8000-000000000002', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-00000000000a', 'Delivery Jantar', '<p>Pedido no <strong>iFood</strong> - Pizza grande.</p>', 55.00, '2026-05-29 20:30:00', 'c0010001-0001-4000-8000-000000000001', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-00000000000b', 'Exames Laboratório', '<p>Exames de <em>rotina</em> mensais.</p>', 200.00, '2026-05-25 07:00:00', 'c0010001-0001-4000-8000-000000000004', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('e0010001-0001-4000-8000-00000000000c', 'Show de música', '<p>Ingresso show <strong>Coldplay</strong> - setor VIP.</p>', 350.00, '2026-05-20 21:00:00', 'c0010001-0001-4000-8000-000000000006', '00000000-0000-4000-a000-000000000001', NOW(), NOW());

-- ============================================================
-- RECURRING EXPENSES (Despesas Recorrentes)
-- ============================================================
INSERT INTO "RecurringExpense" (id, name, notes, price, "categoryId", "userId", "createdAt", "updatedAt") VALUES
  ('a0010001-0001-4000-8000-000000000001', 'Aluguel', '<p>Aluguel do apartamento + <strong>condomínio</strong> incluso.</p>', 1500.00, 'c0010001-0001-4000-8000-000000000003', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000002', 'Conta de Luz', '<p>Energia elétrica - <em>Enel</em>.</p>', 120.00, 'c0010001-0001-4000-8000-000000000003', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000003', 'Internet', '<p>Fibra óptica <strong>500mb</strong> - Claro.</p>', 99.90, 'c0010001-0001-4000-8000-000000000003', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000004', 'Plano de Saúde', '<p><strong>Amil</strong> - plano empresarial.</p>', 350.00, 'c0010001-0001-4000-8000-000000000004', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000005', 'Academia', '<p>Mensalidade <strong>Smart Fit</strong> - plano Black.</p>', 89.90, 'c0010001-0001-4000-8000-000000000004', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000006', 'Streaming Netflix', '<p>Plano <strong>Premium</strong> 4K.</p>', 55.90, 'c0010001-0001-4000-8000-000000000006', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000007', 'Spotify', '<p>Plano <em>Premium Duo</em>.</p>', 34.90, 'c0010001-0001-4000-8000-000000000006', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('a0010001-0001-4000-8000-000000000008', 'Assinatura Office 365', '<p><strong>Microsoft 365</strong> Family.</p>', 42.00, 'c0010001-0001-4000-8000-000000000005', '00000000-0000-4000-a000-000000000001', NOW(), NOW());

-- ============================================================
-- OCCASIONAL REVENUES (Receitas Avulsas)
-- ============================================================
INSERT INTO "OccasionalRevenue" (id, name, notes, price, date, "categoryId", "userId", "createdAt", "updatedAt") VALUES
  ('b0010001-0001-4000-8000-000000000001', 'Freela Site Institucional', '<p>Desenvolvimento de site para <strong>padaria local</strong>.</p>', 2500.00, '2026-06-05 18:00:00', 'c0010001-0001-4000-8000-000000000008', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('b0010001-0001-4000-8000-000000000002', 'Venda de Notebook', '<p>Notebook <strong>Dell XPS 15</strong> usado.</p>', 4500.00, '2026-05-30 15:00:00', 'c0010001-0001-4000-8000-00000000000a', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('b0010001-0001-4000-8000-000000000003', 'Dividendo Ações', '<p>Dividendos <strong>PETR4</strong> recebidos.</p>', 320.00, '2026-06-01 10:00:00', 'c0010001-0001-4000-8000-000000000009', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('b0010001-0001-4000-8000-000000000004', 'Consultoria Financeira', '<p>Consultoria para <em>pequeno empresário</em>.</p>', 800.00, '2026-05-28 14:30:00', 'c0010001-0001-4000-8000-000000000008', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('b0010001-0001-4000-8000-000000000005', 'Bonus Anual', '<p>Bônus de <strong>performance</strong> recebido da empresa.</p>', 3000.00, '2026-05-15 09:00:00', 'c0010001-0001-4000-8000-00000000000a', '00000000-0000-4000-a000-000000000001', NOW(), NOW());

-- ============================================================
-- RECURRING REVENUES (Receitas Recorrentes)
-- ============================================================
INSERT INTO "RecurringRevenue" (id, name, notes, price, "categoryId", "userId", "createdAt", "updatedAt") VALUES
  ('d0010001-0001-4000-8000-000000000001', 'Salário Mensal', '<p>Salário fixo como <strong>Desenvolvedor Sênior</strong> na empresa TechSolutions.</p>', 8500.00, 'c0010001-0001-4000-8000-000000000007', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('d0010001-0001-4000-8000-000000000002', 'Rendimento CDB', '<p>Rendimento mensal do <strong>CDB 110% CDI</strong>.</p>', 180.00, 'c0010001-0001-4000-8000-000000000009', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('d0010001-0001-4000-8000-000000000003', 'Aluguel Recebido', '<p>Aluguel do <em>apartamento na praia</em>.</p>', 1200.00, 'c0010001-0001-4000-8000-00000000000a', '00000000-0000-4000-a000-000000000001', NOW(), NOW()),
  ('d0010001-0001-4000-8000-000000000004', 'Pensão Alimentícia', '<p>Pensão mensal.</p>', 1500.00, 'c0010001-0001-4000-8000-00000000000a', '00000000-0000-4000-a000-000000000001', NOW(), NOW());

-- ============================================================
-- FIM DO SEED
-- ============================================================
