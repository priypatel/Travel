export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-5 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} Priy Patel ·{' '}
      <a
        href="https://github.com/priypatel"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-indigo-600 transition-colors"
      >
        GitHub
      </a>
    </footer>
  );
}
