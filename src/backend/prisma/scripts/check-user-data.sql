SELECT u.id, u.email, u.role,
  (SELECT COUNT(*) FROM "Category" WHERE "userId" = u.id) AS categorias,
  (SELECT COUNT(*) FROM "OccasionalExpense" WHERE "userId" = u.id) AS despesas_avulsas,
  (SELECT COUNT(*) FROM "RecurringExpense" WHERE "userId" = u.id) AS despesas_recorrentes,
  (SELECT COUNT(*) FROM "OccasionalRevenue" WHERE "userId" = u.id) AS receitas_avulsas,
  (SELECT COUNT(*) FROM "RecurringRevenue" WHERE "userId" = u.id) AS receitas_recorrentes
FROM "User" u
ORDER BY u.email;
