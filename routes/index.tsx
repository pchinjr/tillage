import type { State } from "@/plugins/session.ts";
import Header from "@/components/Header.tsx";
import TypingGarden from "@/islands/TypingGarden.tsx";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute<State>((_req, ctx) => {
  const isSignedIn = ctx.state.sessionUser !== undefined;
  const endpoint = "/api/flowers";

  return (
    <div>
      <Header url={ctx.url} sessionUser={ctx.state.sessionUser} />
      <TypingGarden isSignedIn={isSignedIn} endpoint={endpoint} />
    </div>
  );
});
