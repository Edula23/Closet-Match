import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";

const { PrismaClient } = prismaClientPkg;

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export default prisma;