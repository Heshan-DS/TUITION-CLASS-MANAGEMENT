# Vercel Deployment Guide

This project is a Quasar Single Page Application (SPA). Follow these steps to deploy to Vercel.

## 1. Project Configuration

Ensure you have the `vercel.json` file in your root directory (created automatically).

## 2. Deploying via Vercel Dashboard

1.  Push your code to GitHub/GitLab/Bitbucket.
2.  Import the project in Vercel.
3.  **Build & Development Settings**:
    - **Framework Preset**: Select **Other** (or Quasar if available, but 'Other' is safer manually).
    - **Build Command**: `quasar build` (or `npm run build`).
    - **Output Directory**: `dist/spa` <-- **IMPORTANT**
    - **Install Command**: `npm install` (default).

## 3. Environment Variables

Don't forget to add your Supabase variables in the Vercel Project Settings > Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

## 4. Deploy

Click **Deploy**!
