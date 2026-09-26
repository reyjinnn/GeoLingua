# GeoLingua Frontend

GeoLingua is a learning platform designed to help users effectively master a new language through a structured learning cycle: **Learn → Drill → Write → Quiz**. This project is the frontend repository built using a modern foundation of React 18, TypeScript, and Vite to provide an interactive, fast, and responsive user experience.

The structure and development of this project follow these main documents:
- [Technical Architecture]
- [API Specification]
- [UI/UX Specification]

## Local Setup

To start development on your local machine, run the following commands:

```bash
pnpm install
pnpm dev
```

### Connecting to Local Backend

To connect the frontend to the local backend, you need to configure the environment variables:
1. Copy the `.env.example` file to `.env.local`. 
   In PowerShell, use the command: `Copy-Item .env.example .env.local`
2. Run the backend from the `../backend-GeoLingua` folder using the command: `php -S localhost:8000 index.php`

**Note:** The backend currently only provides the `/api/health` endpoint. Routes for authentication, curriculum, and drills have been set up in the frontend, but pages requiring those endpoints will display API error messages until the backend implementation is complete.

## Directory Structure

This project is organized with the following modular structure:
- `src/api/`: Wrapper for the `fetch` function and API endpoint contract definitions.
- `src/types/`: Data type and interface definitions (TypeScript interfaces/types) for API payloads.
- `src/context/`, `src/hooks/`: Global state management (e.g., login sessions) and custom logic related to user learning preferences.
- `src/routes/`: Application navigation route configuration (public, learner, and admin) equipped with route guards.
- `src/pages/`: Main page components representing the core application flow; pages still in development will show a coming soon/preparation status.
- `src/components/`: A collection of reusable user interface (UI) elements.
- `src/utils/`: Supporting utility functions such as authorization token storage and text validation.

## Development Commands

- `pnpm build`: Performs type checking and builds the application for the production environment.
- `pnpm lint`: Runs ESLint to ensure code quality and formatting standards are met.

## Contribution Guidelines (Git Workflow)

To keep a clean commit history and facilitate collaboration, if you wish to push and contribute, you **must** create a new branch with a specific naming format. Avoid pushing directly to the main branches (`main` or `master`).

The branch naming format used is:
- **`feat/<feature_name>`**: Used when adding a new feature.
- **`fix/<fix_name>`**: Used when fixing a bug or error.
- **`docs/<docs_name>`**: Used when adding or updating documentation.
- **`refactor/<refactor_name>`**: Used when restructuring or rewriting code without changing its functionality.
- **`style/<style_name>`**: Used for code style, formatting, or linting changes.

**Contribution steps:**
1. Pull the `development` branch.
2. Create a new branch from the main branch: `git checkout -b <branch_type>/<your_branch_name>`
3. Make your code changes.
4. Commit your changes with a clear and descriptive message.
5. Push your branch to the repository: `git push origin <branch_type>/<your_branch_name>`
6. Create a Pull Request (PR) for the team to review.
