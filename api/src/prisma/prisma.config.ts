export function applyPrismaConfig(): void {
  // Define a default DATABASE_URL here so Prisma client can pick it up at runtime.
  // You can override this with environment variables or CI secrets.
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://postgres:docker@localhost:5432/desafio';
  }
}

export const PRISMA_DATABASE_URL = process.env.DATABASE_URL;
