// API route for saving and fetching user flower state using Deno KV as the backing store
import { FreshContext, Handlers } from "$fresh/server.ts"; // Import types for request handlers and context from Fresh
import { kv } from "@/utils/db.ts"; // Import the Deno KV (key-value store) utility for interacting with persistent storage
import type { User } from "@/utils/db.ts"; // Import the User type
import type { State } from "@/plugins/session.ts"; // Import the State type from the session plugin

// Interface to define the shape of the flower state
interface FlowerState {
  flowers: { id: number; left: string; bottom: string }[]; // Array of flowers with id, left, and bottom properties
}

// Define a handler for managing HTTP requests (GET/POST) related to flower state
export const handler: Handlers<State> = {
  // POST request handler to save flower state to Deno KV
  async POST(req, ctx: FreshContext<State>) {
    // Check if the user is authenticated by verifying the presence of sessionUser
    if (!ctx.state.sessionUser) {
      return new Response("Unauthorized", { status: 401 }); // Respond with 401 if user is not authenticated
    }

    // Extract the authenticated user from the context
    const user: User = ctx.state.sessionUser;

    // Parse the request body to get the flower state data
    const flowerState: FlowerState = await req.json();

    // Define the key for storing flower state, using the user's login as part of the key
    const key = ["flower_state", user.login];
    // Save the flower state to the Deno KV store under the generated key
    await kv.set(key, flowerState);

    // Respond with a success message and status 200
    return new Response("Flower state saved", { status: 200 });
  },

  // GET request handler to fetch the flower state from Deno KV
  async GET(_req, ctx: FreshContext<State>) {
    // Check if the user is authenticated by verifying the presence of sessionUser
    if (!ctx.state.sessionUser) {
      return new Response("Unauthorized", { status: 401 }); // Respond with 401 if user is not authenticated
    }

    // Extract the authenticated user from the context
    const user: User = ctx.state.sessionUser;
    // Define the key for retrieving flower state, using the user's login
    const key = ["flower_state", user.login];

    // Retrieve the flower state from the Deno KV store
    const result = await kv.get<FlowerState>(key);
    // If no flower state is found, return a 404 response
    if (!result.value) {
      return new Response("No flower state found", { status: 404 });
    }

    // If flower state is found, return it as JSON with a 200 status
    return new Response(JSON.stringify(result.value), {
      status: 200,
      headers: { "Content-Type": "application/json" }, // Specify the response content type as JSON
    });
  },
};
