// plugins/kv_oauth.ts
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import type { Plugin } from "$fresh/server.ts";

const { signIn, handleCallback, signOut, getSessionId } = createHelpers(
  createGitHubOAuthConfig(),
);

const kv = await Deno.openKv();

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
        const { response, tokens, sessionId } = await handleCallback(req);
        const userResponse = await fetch("https://api.github.com/user", {
          "headers": {
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": `Bearer ${tokens.accessToken}`,
          },
        });
        const user = await userResponse.json();
        console.log(user);
        await kv.set(["sessions", sessionId], {
          user: user.id,
          sessionId,
          timestamp: Date.now(),
        });
        await kv.set(["users", user.id], {
          sessionId,
          name: user.name,
          avatar: user.avatar_url,
          bio: user.bio,
        });
        return response;
      },
    },
    {
      path: "/signout",
      async handler(req) {
        const sessionId = await getSessionId(req);
        if (sessionId) {
          // Delete the session information from Deno KV
          await kv.delete(["sessions", sessionId]);
        }
        return await signOut(req);
      },
    },
    {
      path: "/protected",
      async handler(req) {
        const session = await getSessionId(req);
        if (session) {
          const sessionLookup = await kv.get(["sessions", session]);
          console.log(sessionLookup);
          const userLookup = await kv.get(["users", sessionLookup.value.user]);
          console.log(userLookup);
          return new Response(
            "You are allowed " + `${(userLookup.key[1])}` +
              `: ${userLookup.value.name}` + ` - ${userLookup.value.bio}`,
          );
        }
        return new Response("Unauthorized", { status: 401 });
      },
    },
  ],
} as Plugin;
