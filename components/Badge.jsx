export default function Badge({ children, tone }) {
  return <span className={"bdg" + (tone ? " " + tone : "")}>{children}</span>;
}
