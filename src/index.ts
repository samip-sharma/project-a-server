import app from "./app.js";
import { serve } from "@hono/node-server";

serve({ fetch: app.fetch, port: 3000 });
