import { defineConfig } from "$fresh/server.ts";
import kv_oauth from "./plugins/kv_oauth.ts";
import sessionPlugin from "@/plugins/session.ts";

export default defineConfig({
  plugins: [kv_oauth, sessionPlugin],
});
