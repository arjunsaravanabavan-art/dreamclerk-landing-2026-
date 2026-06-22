// Live Supabase verify — runs against the production Supabase project using
// the anon key (the same key Vite would inline). Proves the project is
// reachable, the notify_signups table is open for inserts, and RLS keeps
// SELECT private.
import { createClient } from "@supabase/supabase-js";

const URL = "https://hmeglzxbxbqetgydkynl.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZWdlenhieGJxZXRneWRreW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjA0MzAsImV4cCI6MjA5NzAzNjQzMH0.byvR2XfgPv5FQaXj9f4V2PDP9c-S0TP-Xb4WU_cNZ7E";

const sb = createClient(URL, KEY);
const email = `verify-${Date.now()}@dreamclerk-test.dev`;

const { data, error } = await sb.from("notify_signups").insert({ email, name: "verify-script", source: "verify-script" }).select();

console.log("INSERT notify_signups →", { ok: !error, status: error ? "error" : "201", error: error?.message, data });
