// ── Humanoid Hub configuration ─────────────────────────────
// Supabase anon key is public by design (RLS protects the data:
// anonymous visitors can INSERT leads, nobody anonymous can read them).
export const CONFIG = {
  SUPABASE_URL: "https://jdayxvgrrrmtiouktcsg.supabase.co", // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYXl4dmdycnJtdGlvdWt0Y3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTgzNzgsImV4cCI6MjA5OTUzNDM3OH0.qtqW-CRDphwCvvo4peGnm5VRpco_8prZp8S8bDaDhYU",
  BRAND_NAME: "Humanoid Hub", // final name, not a placeholder
  CONTACT_EMAIL: "ledogmanben@gmail.com",
  SITE_URL: "https://tothriveistoderive.github.io/humanoid-hub", // real, live GitHub Pages URL. Update again if a custom domain is bought

  // ── Used by the privacy policy (GDPR Art. 13 requires naming the controller)
  // TODO: replace with the registered entity name once the business is formed.
  // Until then a sole trader is legally identified by their own full name.
  LEGAL_ENTITY: "Ben Ledogman, sole trader",
  LEGAL_COUNTRY: "Israel",
  // TODO: CONFIRM in the Supabase dashboard (Project Settings → General → Region)
  // before launch. The policy states this to EU visitors, so it must be accurate.
  DB_REGION: "the European Union (Frankfurt)",
};
