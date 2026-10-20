export function isEventUpcoming(eventDate: string): boolean {
  const eventDateTime = new Date(eventDate);
  const now = new Date();
  const diffTime = eventDateTime.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 && diffDays <= 10;
}

export function isEventCompleted(eventDate: string): boolean {
  const eventDateTime = new Date(eventDate);
  const now = new Date();

  return eventDateTime < now;
}
