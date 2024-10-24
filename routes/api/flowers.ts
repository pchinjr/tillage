// API route for saving and fetching user flower state using Deno KV as the backing store
import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "@/utils/db.ts";
import type { User } from "@/utils/db.ts";
import type { State } from "@/plugins/session.ts";

interface FlowerState {
  flowers: { id: number; left: string; bottom: string }[];
}

export const handler: Handlers<State> = {
  async POST(req, ctx: FreshContext<State>) {
    if (!ctx.state.sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user: User = ctx.state.sessionUser;

    const flowerState: FlowerState = await req.json();

    const key = ["flower_state", user.login];
    await kv.set(key, flowerState);

    return new Response("Flower state saved", { status: 200 });
  },

  async GET(_req, ctx: FreshContext<State>) {
    if (!ctx.state.sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user: User = ctx.state.sessionUser;
    const key = ["flower_state", user.login];

    const result = await kv.get<FlowerState>(key);
    if (!result.value) {
      return new Response("No flower state found", { status: 404 });
    }

    return new Response(JSON.stringify(result.value), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};
