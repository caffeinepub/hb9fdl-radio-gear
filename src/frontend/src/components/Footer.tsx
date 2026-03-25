export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  return (
    <footer
      className="w-full py-6 text-center text-sm"
      style={{
        background: "oklch(0.15 0.05 240)",
        color: "oklch(0.65 0.02 230)",
      }}
    >
      <p className="mb-1" style={{ color: "oklch(0.75 0.02 230)" }}>
        © HB9FDL / OH6KNW Radio Gear — All rights reserved
      </p>
      <p>
        © {year}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.72 0.12 185)" }}
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
