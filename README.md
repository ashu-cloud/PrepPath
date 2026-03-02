This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database Configuration

This project expects a `DATABASE_URL` environment variable pointing to a
PostgreSQL database (we use Neon). Create a `.env.local` file in the project
root with a line such as:

```env
DATABASE_URL="postgresql://username:password@<your-db-host>.db.neon.tech/<dbname>?sslmode=require"

# Common pitfall
# Instead of the `db` host you might accidentally copy the `api` endpoint
# from Neon (it looks similar but starts with `api.`). Using the API URL
# results in errors like `ENOTFOUND` or `Connect Timeout Error` as you're
# seeing in the screenshot.  Make sure the host part of the string ends with
# `.db.neon.tech`.

# (Optional) model override for Gemini content generation
# The project defaults to `gemini-2.5-flash`, but you'll need to update
# this if Google retires the model or you want to try a different one.
# Use `npm run list-models` or inspect the API to see what's available.
GEMINI_CONTENT_MODEL="gemini-2.5-flash"
```

> **Important:** copy the **connection string** from your Neon dashboard and
> make sure the host is the `db` endpoint (e.g. `*.db.neon.tech`) not the
> `api` endpoint. An incorrect host will produce the `getaddrinfo ENOTFOUND`
> errors you were seeing.

Restart the development server after updating `.env.local` so Next.js picks up
the new variable.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
