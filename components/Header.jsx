import Link from "next/link";

export default function Header() {
  return (
    <header className="site">
      <div className="wrap">
        <Link className="brand" href="/">
          Humanoid Hub <span className="tag">EMEA</span>
        </Link>
        <nav className="main">
          <Link className="navlink" href="/#lineup">Robots</Link>
          <Link className="navlink" href="/#process">How it works</Link>
          <Link className="navlink" href="/#pricelist">Price list</Link>
          <Link className="btn accent" href="/#quote">Request a quote</Link>
        </nav>
      </div>
    </header>
  );
}
