// plugins/kv_oauth.ts

// Import necessary types and functions from Fresh and external utilities
import type { Plugin } from "$fresh/server.ts"; // Plugin type for Fresh framework
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth"; // OAuth helpers for GitHub authentication using Deno KV
import {
  createUser, // Function to create a new user in the database
  getUser, // Function to retrieve an existing user from the database
  updateUserSession, // Function to update the user's session
  type User, // User type definition
} from "@/utils/db.ts"; // Utility functions related to user database operations
import { getGitHubUser } from "@/utils/github.ts"; // Helper to fetch user info from GitHub

// Destructure the sign-in, callback, and sign-out helpers for OAuth
const { signIn, handleCallback, signOut } = createHelpers(
  createGitHubOAuthConfig(), // Configuration for GitHub OAuth using Deno KV
);

export default {
  name: "kv-oauth", // Name of the plugin
  routes: [
    {
      path: "/signin", // Route for signing in with GitHub OAuth
      async handler(req) {
        return await signIn(req); // Handle the sign-in process
      },
    },
    {
      path: "/callback", // Route that GitHub redirects to after authentication
      async handler(req) {
        // Handle the OAuth callback, retrieving response, tokens, and sessionId
        const { response, tokens, sessionId } = await handleCallback(req);

        // Fetch the authenticated GitHub user data using the access token
        const githubUser = await getGitHubUser(tokens.accessToken);
        // Try to retrieve the user from the database using their GitHub login
        const user = await getUser(githubUser.login);

        if (user === null) {
          // If user does not exist, create a new user in the database
          const user: User = {
            login: githubUser.login, // Set the user's login as their GitHub login
            sessionId, // Associate the sessionId with the new user
          };
          await createUser(user); // Save the new user to the database
        } else {
          // If user already exists, update their session
          await updateUserSession(user, sessionId);
        }

        return response; // Return the OAuth callback response
      },
    },
    {
      path: "/signout", // Route to handle signing out
      async handler(req) {
        return await signOut(req); // Handle the sign-out process
      },
    },
  ],
} as Plugin; // Export the object as a Fresh plugin
