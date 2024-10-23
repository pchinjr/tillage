import Header from "../components/Header.tsx";
import TypingGarden from "../islands/TypingGarden.tsx";
import DarkModeToggle from "../islands/DarkModeToggle.tsx";
import { useEffect } from "preact/hooks";
import { Handlers, PageProps } from "$fresh/server.ts";

import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
const { getSessionId } = createHelpers(
  createGitHubOAuthConfig(),
);

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(req, ctx) {
    const session = await getSessionId(req);
    if (session) {
      const sessionLookup = await kv.get(["sessions", session]);
      console.log(sessionLookup);
      const userLookup = await kv.get(["users", sessionLookup.value.user]);
      console.log(userLookup);
      return await ctx.render({
        username: userLookup.value.name,
        userId: userLookup.value.id,
      });
    }
    return await ctx.render({ username: null });
  },
};

export default function Home({ data }: PageProps<{ username: string | null }>) {
  const { username } = data;

  useEffect(() => {
    const darkModeSetting = localStorage.getItem("darkMode");
    if (darkModeSetting === "enabled") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  return (
    <div>
      <Header username={username} />
      <TypingGarden />
      <DarkModeToggle />
    </div>
  );
}
