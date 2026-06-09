-- ============================================================
-- Promove usuário a administrador e vincula todos os dados a ele
-- Email: winkellandi123@gmail.com
-- ============================================================
-- Execute no SQL Editor do Neon ou via psql:
--   psql "$DATABASE_URL" -f prisma/scripts/promote-admin-and-assign-data.sql
-- ============================================================

BEGIN;

DO $$
DECLARE
  target_user_id UUID;
  target_email  TEXT := 'winkellandi123@gmail.com';
BEGIN
  SELECT id INTO target_user_id
  FROM "User"
  WHERE email = target_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Registre-se antes de executar este script.', target_email;
  END IF;

  -- 1. Promover a administrador
  UPDATE "User"
  SET role = 'admin', "updatedAt" = NOW()
  WHERE id = target_user_id;

  -- 2. Evitar conflito de nomes duplicados em Category (unique: name + userId)
  --    Renomeia categorias de outros usuários que colidiriam com as do alvo
  UPDATE "Category" c
  SET
    name = c.name || ' [migrado ' || LEFT(c.id::text, 8) || ']',
    "updatedAt" = NOW()
  WHERE c."userId" <> target_user_id
    AND EXISTS (
      SELECT 1
      FROM "Category" c2
      WHERE c2."userId" = target_user_id
        AND c2.name = c.name
    );

  -- 3. Vincular categorias ao usuário alvo
  UPDATE "Category"
  SET "userId" = target_user_id, "updatedAt" = NOW()
  WHERE "userId" <> target_user_id;

  -- 4. Vincular despesas avulsas
  UPDATE "OccasionalExpense"
  SET "userId" = target_user_id, "updatedAt" = NOW()
  WHERE "userId" <> target_user_id;

  -- 5. Vincular despesas recorrentes
  UPDATE "RecurringExpense"
  SET "userId" = target_user_id, "updatedAt" = NOW()
  WHERE "userId" <> target_user_id;

  -- 6. Vincular receitas avulsas
  UPDATE "OccasionalRevenue"
  SET "userId" = target_user_id, "updatedAt" = NOW()
  WHERE "userId" <> target_user_id;

  -- 7. Vincular receitas recorrentes
  UPDATE "RecurringRevenue"
  SET "userId" = target_user_id, "updatedAt" = NOW()
  WHERE "userId" <> target_user_id;

  -- 8. Vincular logs de acesso
  UPDATE "AccessLog"
  SET "userId" = target_user_id
  WHERE "userId" <> target_user_id;

  RAISE NOTICE 'Usuário % promovido a admin (id: %). Todos os registros foram vinculados.', target_email, target_user_id;
END $$;

COMMIT;

-- Verificação (opcional)
SELECT
  u.email,
  u.role,
  (SELECT COUNT(*) FROM "Category" WHERE "userId" = u.id) AS categorias,
  (SELECT COUNT(*) FROM "OccasionalExpense" WHERE "userId" = u.id) AS despesas_avulsas,
  (SELECT COUNT(*) FROM "RecurringExpense" WHERE "userId" = u.id) AS despesas_recorrentes,
  (SELECT COUNT(*) FROM "OccasionalRevenue" WHERE "userId" = u.id) AS receitas_avulsas,
  (SELECT COUNT(*) FROM "RecurringRevenue" WHERE "userId" = u.id) AS receitas_recorrentes,
  (SELECT COUNT(*) FROM "AccessLog" WHERE "userId" = u.id) AS logs_acesso
FROM "User" u
WHERE u.email = 'winkellandi123@gmail.com';
