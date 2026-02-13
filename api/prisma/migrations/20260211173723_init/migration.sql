-- CreateEnum
CREATE TYPE "ModeloFasico" AS ENUM ('monofasico', 'bifasico', 'trifasico');

-- CreateEnum
CREATE TYPE "Enquadramento" AS ENUM ('AX', 'B1', 'B2', 'B3');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "codigoDaUnidadeConsumidora" TEXT NOT NULL,
    "modeloFasico" TEXT NOT NULL,
    "enquadramento" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumos" (
    "id" TEXT NOT NULL,
    "consumoForaPontaEmKWH" DOUBLE PRECISION NOT NULL,
    "mesDoConsumo" TIMESTAMP(3) NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_codigoDaUnidadeConsumidora_key" ON "unidades"("codigoDaUnidadeConsumidora");

-- CreateIndex
CREATE INDEX "unidades_codigoDaUnidadeConsumidora_idx" ON "unidades"("codigoDaUnidadeConsumidora");

-- CreateIndex
CREATE UNIQUE INDEX "consumos_unidadeId_mesDoConsumo_key" ON "consumos"("unidadeId", "mesDoConsumo");

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumos" ADD CONSTRAINT "consumos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
