# Code Practice Platform — Full-Stack Free Deployment Guide

This guide walks you through hosting your full-stack coding platform for **100% free** using **Vercel** (for the React frontend) and **Render** (for the Express backend).

It also explains how to switch your database from SQLite to a free **Neon PostgreSQL** database in production to ensure your user data, streaks, and submissions are preserved permanently (since Render's free tier has ephemeral files and resets SQLite databases on every server restart).

---

## Step 1: Push Your Code to GitHub

Before deploying to Vercel or Render, your project needs to be on GitHub.

1. **Create a Private or Public Repository on GitHub**:
   Go to [GitHub](https://github.com) and create a repository named `code-practice-platform`.

2. **Initialize Git in your project folder**:
   Open a terminal in the root workspace directory (`C:\placement project\code pract`) and run:
   ```bash
   git init
   ```

3. **Create a root `.gitignore` file**:
   Make sure you do not commit dependency folders, database binaries, or local secrets. Ensure your `.gitignore` contains:
   ```
   node_modules/
   .env
   dist/
   *.db
   *.db-journal
   ```

4. **Add and Commit your files**:
   ```bash
   git add .
   git commit -m "feat: initial commit for deployment"
   ```

5. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/code-practice-platform.git
   git push -u origin main
   ```

---

## Step 2: Deploy the React Frontend on Vercel (100% Free)

Vercel is the premier platform for static frontend hosting, and will host your Vite frontend under a fast, free SSL-enabled domain.

1. **Sign Up / Log In to Vercel**:
   Go to [Vercel](https://vercel.com) and sign in using your GitHub account.

2. **Import Your Repository**:
   - Click **Add New** -> **Project**.
   - Import your `code-practice-platform` repository.

3. **Configure the Project Build**:
   - **Root Directory**: Select `client` (this is very important!).
   - **Framework Preset**: Choose **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (Vite defaults to this).

4. **Add Environment Variables**:
   Under the **Environment Variables** section, add:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://your-render-backend-url.onrender.com/api` *(You will get this URL in Step 3; you can update this variable in Vercel settings after your backend is running)*

5. **Deploy**:
   Click **Deploy**. Vercel will build your app and give you a public URL (e.g., `https://code-practice-platform.vercel.app`).

---

## Step 3: Deploy the Express Backend on Render (100% Free)

Render runs your Express API and database seeding operations in a Node.js environment.

1. **Sign Up / Log In to Render**:
   Go to [Render](https://render.com) and sign in with GitHub.

2. **Create a New Web Service**:
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.

3. **Configure Your Web Service**:
   - **Name**: `code-pract-backend`
   - **Language**: `Node`
   - **Root Directory**: `server` (extremely important!)
   - **Build Command**: `npm install && npx prisma db push && node prisma/seed.js`
   - **Start Command**: `node src/index.js`
   - **Instance Type**: **Free**

4. **Add Environment Variables**:
   Under the **Advanced** section, click **Add Environment Variable**:
   * `DATABASE_URL` = `file:./dev.db`
   * `JWT_SECRET` = `generate-a-secure-random-key` *(e.g., generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)*
   * `CLIENT_URL` = `https://your-vercel-frontend-url.vercel.app` *(Insert your frontend Vercel URL here to whitelist CORS origin)*

5. **Deploy**:
   Click **Create Web Service**. Your service will build and boot. Once live, Render will display a public URL at the top of the dashboard page (e.g., `https://code-pract-backend.onrender.com`). Copy this URL and set it as `VITE_API_URL` on Vercel!

---

## Step 4: [Highly Recommended] Switch SQLite to Free Neon PostgreSQL for Permanent Data Persistence

**Why do this?** Render's free tier has an ephemeral disk. Every time your backend server goes to sleep (after 15 minutes of inactivity) or restarts, your SQLite `dev.db` file is wiped clean and re-created from the seed files. All registered users, test runs, and submissions will disappear.

By spending **5 minutes** connecting to a free **Neon PostgreSQL** database, your data remains persistent forever!

### 1. Get a Free PostgreSQL Database
1. Go to [Neon](https://neon.tech) and create a free account.
2. Create a new project called `code-pract`.
3. Copy the **Connection String** from your Neon dashboard (it starts with `postgresql://`).

### 2. Update the Prisma Schema
Modify `server/prisma/schema.prisma` to support PostgreSQL:
```prisma
datasource db {
  provider = "postgresql" // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Update Render Environment Variables
Go to your Render backend dashboard -> **Environment** -> edit `DATABASE_URL`:
* **Value**: Replace `file:./dev.db` with your Neon PostgreSQL connection string.

### 4. Re-deploy
Prisma will automatically run migrations and synchronize your PostgreSQL database structure next time your server builds on Render.
