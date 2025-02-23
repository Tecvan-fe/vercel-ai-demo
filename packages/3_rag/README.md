# 基于 vercel ai sdk 的 RAG 应用

## prerequites

- you should follow the steps to install [PostgreSql](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database#setting-up-postgresql-on-macos)

## init database

```
DATABASE_URL=xxx npm run db:migrate
```

for demo case, you can simply use `DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres` as your database url. For production case, you should use your own database url.
