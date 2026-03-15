// Shared TravelAI logo icon — indigo circle with paper-plane, matches favicon.svg
export default function Logo({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#4F46E5" />
      <path
        fill="white"
        d="M44.5 18.5c-1-1-2.5-1.2-3.7-.4L28 26.2l-8.5-2.1c-.6-.2-1.3 0-1.7.5l-1.5 1.5c-.6.6-.4 1.6.4 1.9l6.8 2.5-4.2 5.2-3-.5c-.5-.1-1 .1-1.3.5l-.8.8c-.5.5-.3 1.3.3 1.6l4 1.7 1.7 4c.3.6 1.1.8 1.6.3l.8-.8c.4-.4.6-.9.5-1.4l-.5-3 5.2-4.2 2.5 6.8c.3.8 1.3 1 1.9.4l1.5-1.5c.5-.5.6-1.1.5-1.7L32 29l8-12.8c.8-1.2.6-2.7-.5-3.7z"
      />
    </svg>
  );
}
