# Project Setup

This project is a portfolio and CMS app built with Vite, React, Firebase, and a small Express email API.

## Required local setup

1. Copy the example environment file:
   `copy .env.example .env`
2. Add your own values for:
   - Firebase config
   - admin email
   - email provider API key
3. Keep `.env` local and do not commit it to Git.

## Local run

```bash
npm install
npm run dev
```

## Important

- Never push API keys, private credentials, personal email addresses, or secrets to GitHub.
- Use local environment variables only.
- If you deploy publicly, configure secrets in the host environment instead of hardcoding them in source files.
