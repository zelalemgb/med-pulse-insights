# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c1803311-9568-4220-9a1c-041f7e321277

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c1803311-9568-4220-9a1c-041f7e321277) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c1803311-9568-4220-9a1c-041f7e321277) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Authentication and First Admin Setup

1. **Registration**: New users can create an account via the Sign Up form. The supplied name is stored in Supabase user metadata.
2. **Login / Logout**: Use the Sign In form to authenticate and the Sign Out option to end the session. Authentication state is provided by `AuthContext` and integrates with Supabase.
3. **Creating the First Admin**: When no `national` users exist, an authenticated user can promote themselves to the first administrator. The app calls the `create_first_admin` Supabase function which sets the user's role to `national` and creates the profile record if needed.
4. **Managing Admin Users**: Admin status and user lists are fetched through the new `adminService` and related hooks.

These steps ensure the full authentication flow from initial admin creation through regular user registration and login.

## Cache Manager Configuration

`CacheManager` periodically removes expired entries in the background. The default cleanup interval is **60 seconds**, but it can be customised:

```ts
import { CacheManager } from '@/utils/cacheManager';

const cache = new CacheManager({ cleanupInterval: 30_000 }); // 30 seconds

// Change interval later
cache.setCleanupInterval(120_000);
```

This background task runs even when no new cache entries are added, ensuring stale items do not accumulate.
