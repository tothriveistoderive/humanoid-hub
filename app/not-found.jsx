import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
      <div className="wrap" style={{ padding: "70px 20px", textAlign: "center", maxWidth: 560 }}>
        <p className="muted" style={{ fontFamily: "var(--mono)", fontSize: 13 }}>404</p>
        <h1 style={{ marginTop: 8 }}>This page took a wrong turn.</h1>
        <p className="lede" style={{ marginTop: 10, marginLeft: "auto", marginRight: "auto" }}>
          The page you're looking for doesn't exist, or the link may be out of date. Try the
          catalog, or head back home.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn cta" href="/">Back to homepage</Link>
          <Link className="btn" href="/#catalog">Browse platforms</Link>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
