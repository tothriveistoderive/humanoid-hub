// Renders nothing until real ratings exist (rating stays null in robots.js —
// no invented reviews). Drop in real values and this lights up unchanged.
export default function Rating({ rating, count }) {
  if (rating == null) return null;
  const full = Math.round(rating);
  return (
    <span className="rating" aria-label={`Rated ${rating} out of 5${count ? ` from ${count} reviews` : ""}`}>
      <span className="stars" aria-hidden="true">
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
      {count != null && <span>({count})</span>}
    </span>
  );
}
