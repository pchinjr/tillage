// plugins/kv_oauth.ts
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import type { Plugin } from "$fresh/server.ts";

const { signIn, handleCallback, signOut, getSessionId } = createHelpers(
  createGitHubOAuthConfig({ scope: "read:user" }),
);

export default {
  name: "kv-oauth",
  routes: [
    {
      path: "/signin",
      async handler(req) {
        return await signIn(req);
      },
    },
    {
      path: "/callback",
      async handler(req) {
        // Return object also includes `accessToken` and `sessionId` properties.
        const { response, tokens } = await handleCallback(req);

        const userResponse = await fetch("https://api.github.com/user", {
          "headers": {
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": `Bearer ${tokens.accessToken}`,
          },
        });
        const user = await userResponse.json();

        // Store the user data in cookies or session storage
        const headers = new Headers(response.headers);
        headers.set("Set-Cookie", `username=${user.name}; Path=/; HttpOnly`);

        return new Response(response.body, {
          status: response.status,
          headers,
        });
      },
    },
    {
      path: "/signout",
      async handler(req) {
        const signoutResponse = await signOut(req);

        // Clear the username cookie
        const headers = new Headers(signoutResponse.headers);
        headers.set("Set-Cookie", "username=; Path=/; Max-Age=0; HttpOnly");

        return new Response(signoutResponse.body, {
          status: signoutResponse.status,
          headers,
        });
      },
    },
    {
      path: "/protected",
      async handler(req) {
        return await getSessionId(req) === undefined
          ? new Response("Unauthorized", { status: 401 })
          : new Response("You are allowed");
      },
    },
  ],
} as Plugin;
