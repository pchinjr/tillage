import Header from "../components/Header.tsx";
import TypingGarden from "../islands/TypingGarden.tsx";
import DarkModeToggle from "../islands/DarkModeToggle.tsx";
import { useEffect } from "preact/hooks";
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    // Parse the username from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = new Map(
      cookieHeader.split("; ").map((c) => c.split("=") as [string, string]),
    );
    const username = cookies.get("username")
      ? decodeURIComponent(cookies.get("username")!)
      : null;

    return await ctx.render({ username });
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
