export function renderDate(dateString: string | null | undefined) {
  if (!dateString) return null;

  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("default", {
    year:  "numeric",
    month: "long",
    day:   "numeric"
  });
  return <time dateTime={dateString}>{formattedDate}</time>;
}