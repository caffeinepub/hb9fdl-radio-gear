import { Link } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function Header() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "oklch(0.18 0.055 240)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-80 opacity-10"
          viewBox="0 0 320 80"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          {[20, 50, 80, 110, 140, 170, 200].map((r) => (
            <circle
              key={r}
              cx="320"
              cy="40"
              r={r}
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      </div>
      <div className="relative max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-ocid="nav.link">
          <svg
            aria-hidden="true"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className="flex-shrink-0"
          >
            <line
              x1="18"
              y1="2"
              x2="18"
              y2="34"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="34"
              x2="28"
              y2="34"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="2"
            />
            <line
              x1="12"
              y1="20"
              x2="18"
              y2="8"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="1.5"
            />
            <line
              x1="24"
              y1="20"
              x2="18"
              y2="8"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="1.5"
            />
            <line
              x1="10"
              y1="28"
              x2="26"
              y2="28"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="1.5"
            />
            <path
              d="M22 6 Q28 10 24 18"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M14 6 Q8 10 12 18"
              stroke="oklch(0.72 0.12 185)"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          </svg>
          <div>
            <div className="text-white font-bold text-base tracking-widest">
              HB9FDL/OH6KNW
            </div>
            <div
              style={{ color: "oklch(0.72 0.12 185)" }}
              className="text-xs tracking-[0.2em] uppercase"
            >
              Radio
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <Link
            to="/equipment"
            className="px-4 py-2 text-sm font-semibold rounded-md transition-colors"
            style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
            data-ocid="equipment.link"
          >
            Myytävät laitteet
          </Link>
          {identity && isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 text-sm font-semibold rounded-md transition-colors"
              style={{
                background: "oklch(0.30 0.08 240)",
                color: "oklch(0.72 0.12 185)",
                border: "1px solid oklch(0.72 0.12 185 / 0.4)",
              }}
              data-ocid="admin.link"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
