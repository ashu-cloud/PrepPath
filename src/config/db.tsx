// import { drizzle } from 'drizzle-orm/neon-http';

// const db = drizzle(process.env.DATABASE_URL!);

// export default db;

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// ensure DATABASE_URL is provided (Next.js automatically loads .env.local)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not defined. " +
      "Please set it in .env.local with your Neon connection string (use the 'db' host, not 'api')."
  );
}

// very common user error: copying the 'api' endpoint from Neon dashboard
// instead of the actual database host.  The `api` URL will never resolve
// and results in ENOTFOUND / timeout errors in the server console.
if (process.env.DATABASE_URL.includes("api.")) {
  throw new Error(
    "Your DATABASE_URL contains an 'api.' hostname. " +
      "Make sure you paste the connection string that uses the 'db' endpoint " +
      "(e.g. 'xxxx.db.neon.tech'), not the 'api' one."
  );
}

const pg = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: pg });
export default db;