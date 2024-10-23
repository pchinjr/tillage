import type { State } from "@/plugins/session.ts";
import { defineApp } from "$fresh/server.ts";

export default defineApp<State>((_, ctx) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>tillage</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <ctx.Component />
      </body>
    </html>
  );
});
