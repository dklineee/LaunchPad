# LaunchPad frontend

React + TypeScript + Material UI, built with Vite. This is a frontend-only demo; it does not contact Kubernetes or provision infrastructure.

## Run locally

Use Node.js 22.12 or newer.

```sh
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173).

## Check production build

```sh
npm run build
npm run preview
```

## Try it

Create an environment with a lowercase name such as feature-login. It transitions from Provisioning to Running after 3 seconds. Preview shows a simulated application dialog. Search filters the list; Delete asks for confirmation. Names must be unique in the session. Lifetimes mark environments Expired but do not automatically remove them. Refresh clears all demo state.

## Code map

- src/main.tsx: React entry point and MUI theme.
- src/App.tsx: dashboard, dialogs, validation, and in-memory simulation.
- src/style.css: responsive layout and visual styling.

## Next step

Replace in-memory environment state with FastAPI endpoints for list, create, status, and delete. Keep Kubernetes credentials in the backend; never embed them in frontend code. Real routing, authentication, quotas, and expiry cleanup are future backend work.
