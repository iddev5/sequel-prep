export function formatTimeAgo(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60)
    return `${diffSec} seconds ago`;

  if (diffMin < 60)
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;

  if (diffHour < 24)
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;

  return date.toLocaleString();
}
