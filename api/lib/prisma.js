// this file sets up and exports the Prisma Client for database access
// imports
import { PrismaClient } from '../generated/prisma/index.js';

// initialize Prisma Client
const prisma = new PrismaClient();

export default prisma;
