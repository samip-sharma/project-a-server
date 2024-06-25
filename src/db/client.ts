import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const postgresClient = postgres("postgres://postgres:postgres@0.0.0.0:5432/project_a");
const drizzleClient = drizzle(postgresClient);

export default drizzleClient;
