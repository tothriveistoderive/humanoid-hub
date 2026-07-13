// ── Humanoid Hub configuration ─────────────────────────────
// Supabase anon key is public by design (RLS protects the data:
// anonymous visitors can INSERT leads, nobody anonymous can read them).
export const CONFIG = {
  SUPABASE_URL: "https://jdayxvgrrrmtiouktcsg.supabase.co", // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYXl4dmdycnJtdGlvdWt0Y3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTgzNzgsImV4cCI6MjA5OTUzNDM3OH0.qtqW-CRDphwCvvo4peGnm5VRpco_8prZp8S8bDaDhYU",
  BRAND_NAME: "Humanoid Hub", // placeholder — swap when the real name lands
  CONTACT_EMAIL: "ledogmanben@gmail.com",
  SITE_URL: "https://tothriveistoderive.github.io/humanoid-hub", // set after deploy, e.g. "https://USER.github.io/humanoid-hub"
};
