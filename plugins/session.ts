import { Plugin } from "$fresh/server.ts"; // Import the Plugin type for Fresh framework
import type { FreshContext } from "$fresh/server.ts"; // Import FreshContext type for route handling
import { getUserBySession } from "@/utils/db.ts"; // Utility function to retrieve user by session ID from the database
import type { User } from "@/utils/db.ts"; // Type definition for User
import { UnauthorizedError } from "@/utils/http.ts"; // Custom error for unauthorized access

import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth"; // Import OAuth helper functions

// Destructure the getSessionId helper function from the OAuth config
const { getSessionId } = createHelpers(
  createGitHubOAuthConfig(), // Pass GitHub OAuth config
);

// Define the State interface, where sessionUser is optional
export interface State {
  sessionUser?: User; // sessionUser stores the logged-in user, or undefined if not logged in
}

// Type alias to enforce that sessionUser is required
export type SignedInState = Required<State>;

// Function to assert that the user is signed in by checking the sessionUser in the state
export function assertSignedIn(
  ctx: { state: State }, // Context object holding the state
): asserts ctx is { state: SignedInState } { // Asserts the state contains a sessionUser
  if (ctx.state.sessionUser === undefined) {
    // If sessionUser is undefined, throw an UnauthorizedError
    throw new UnauthorizedError("User must be signed in");
  }
}

// Middleware to set session state, extracting the session ID from the request
async function setSessionState(
  req: Request, // The HTTP request object
  ctx: FreshContext<State>, // Fresh context, which includes the state
) {
  if (ctx.destination !== "route") return await ctx.next(); // If it's not a route, skip middleware

  // Initialize sessionUser in the state as undefined
  ctx.state.sessionUser = undefined;

  // Attempt to retrieve the sessionId from the request
  const sessionId = await getSessionId(req);
  if (sessionId) {
    // If a sessionId is found, try to get the user associated with that session
    const user = await getUserBySession(sessionId);
    if (user) {
      ctx.state.sessionUser = user; // If user exists, set sessionUser in the state
    }
  }
  return await ctx.next(); // Proceed to the next middleware or route handler
}

// Middleware to ensure the user is signed in by calling assertSignedIn
async function ensureSignedIn(
  _req: Request, // The HTTP request object (not used here)
  ctx: FreshContext<State>, // Fresh context, which includes the state
) {
  assertSignedIn(ctx); // Ensure that the user is signed in
  return await ctx.next(); // Proceed to the next middleware or route handler
}

export default {
  name: "session", // Name of the plugin
  middlewares: [
    {
      path: "/", // Apply setSessionState middleware to all routes starting with "/"
      middleware: { handler: setSessionState }, // Set session state for the request
    },
    {
      path: "/account", // Protect the "/account" route
      middleware: { handler: ensureSignedIn }, // Ensure the user is signed in before accessing
    },
    {
      path: "/dashboard", // Protect the "/dashboard" route
      middleware: { handler: ensureSignedIn }, // Ensure the user is signed in before accessing
    },
    {
      path: "/api/flowers", // Protect the "/api/flowers" endpoint
      middleware: { handler: ensureSignedIn }, // Ensure the user is signed in before accessing
    },
  ],
} as Plugin<State>; // Export the object as a Fresh plugin with the State type