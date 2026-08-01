# Shaikh China Sourcing ERP — GitHub Pages Frontend

This package contains the approved Version 1 frontend for Shaikh China Sourcing ERP.
It uses HTML5, CSS3, Vanilla JavaScript, Supabase Authentication, and the existing
live SCS ERP Supabase project.

## Upload to GitHub

1. Create a new GitHub repository.
2. Upload **all files and folders from this package** to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then click **Save**.
6. Wait for GitHub to show the published website URL.

The top-level `index.html` is the website entry file. The `assets` and `pages`
folders must remain beside it because they contain the application styling,
authentication, and ERP modules.

## Supabase redirect configuration

After GitHub Pages publishes the site, add the GitHub Pages URL in Supabase:

1. Open the SCS ERP Supabase project.
2. Go to **Authentication → URL Configuration**.
3. Set **Site URL** to the GitHub Pages site URL.
4. Add these redirect URLs, replacing the example domain and repository name:

   - `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`
   - `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/pages/auth/`
   - `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/pages/auth/reset-password.html`
   - `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/pages/dashboard/`

## Security

- The browser contains only the Supabase publishable key, which is expected for
  a public frontend.
- Never add a Supabase service-role key, database password, or private secret to
  this repository.
- Database access remains protected by Supabase Row Level Security.

