# 🔧 Backend

## Configuração do Ambiente (Backend)

### 1. Acesse a pasta do backend e instale dependências

```bash
cd api
pnpm install
```

### 2. Crie o arquivo `.env` na raiz do backend

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# API de Decodificação de Faturas
MAGIC_PDF_URL="https://magic-pdf.solarium.newsun.energy/v1/magic-pdf"

# Porta da Aplicação
PORT=3000

# Credenciais do Banco (para Docker)
DB_USER=user
DB_PASSWORD=password
DB_NAME=dbname
```

> ⚠️ **Atenção:**  
> Altere `user`, `password` e `dbname` conforme sua preferência.

---

### 3. Subindo o Banco de Dados com Docker

```bash
# Subir o banco
docker compose up -d

# Verificar se o container está rodando
docker ps

```

---

### 4. Configuração do Prisma

```bash
# Gerar o cliente Prisma
pnpm  prisma:generate

# Executar as migrações
pnpm prisma:migrate
```

---

### 5. Rodando o Backend em Desenvolvimento

```bash
pnpm start:dev
```

---

# 💻 Frontend

## Configuração do Ambiente (Frontend)

### 1. Acesse a pasta do frontend

```bash
cd web
```

### 2. Crie o arquivo `.env.local`

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> ⚠️ **Atenção:**  
> Altere a porta se o backend estiver rodando em uma porta diferente.

---

### 3. Instale as dependências

```bash
pnpm install
```

---

### 4. Execute o Frontend em Desenvolvimento

```bash
pnpm dev
```
