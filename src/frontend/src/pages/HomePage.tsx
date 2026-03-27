import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  useHomepageContent,
  useIncrementVisitorCount,
  useVisitorCount,
} from "../hooks/useQueries";

function RadioWavesSVG({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[40, 80, 120, 160, 200, 240, 280, 320].map((r, i) => (
        <circle
          key={r}
          cx="400"
          cy="200"
          r={r}
          stroke="oklch(0.72 0.12 185)"
          strokeWidth="1"
          fill="none"
          opacity={0.15 - i * 0.015}
        />
      ))}
    </svg>
  );
}

function WaveformSVG() {
  const points = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 79) * 500;
    const amp = 20 * Math.sin(i * 0.5) * Math.exp(-Math.abs(i - 40) * 0.04);
    return `${x},${50 + amp}`;
  }).join(" ");

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 500 100"
      className="w-full h-16"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
          <stop
            offset="0%"
            stopColor="oklch(0.72 0.12 185)"
            stopOpacity="0.8"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.72 0.12 185)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function HomePage() {
  const { data: content, isLoading } = useHomepageContent();
  const [operatorName, setOperatorName] = useState("Teemu");
  const [secondPhoto, setSecondPhoto] = useState<string | null>(null);
  const { data: visitorCount } = useVisitorCount();
  const { mutate: incrementVisitor } = useIncrementVisitorCount();

  // biome-ignore lint/correctness/useExhaustiveDependencies: increment once on mount
  useEffect(() => {
    incrementVisitor();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("operatorName");
    if (stored) setOperatorName(stored);
    const storedPhoto = localStorage.getItem("secondPhoto");
    if (storedPhoto) setSecondPhoto(storedPhoto);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.22 0.055 240)" }}
    >
      <Header />

      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "340px", background: "oklch(0.18 0.055 240)" }}
      >
        <RadioWavesSVG className="absolute right-0 top-0 h-full w-1/2 opacity-30" />

        <div className="absolute inset-0 pointer-events-none">
          {[20, 50, 80].map((pct) => (
            <div
              key={pct}
              className="absolute w-full h-px"
              style={{
                top: `${pct}%`,
                background: "oklch(0.72 0.12 185 / 0.06)",
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10">
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-sm tracking-[0.3em] uppercase mb-2"
              style={{ color: "oklch(0.72 0.12 185)" }}
            >
              Welcome to
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-3 break-words">
              HB9FDL / OH6KNW
            </h1>
            <h2
              className="text-lg md:text-2xl font-light mb-6 md:mb-8"
              style={{ color: "oklch(0.80 0.06 200)" }}
            >
              Ham Radio Equipment Sales
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/equipment" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 min-h-[48px]"
                  style={{
                    background: "oklch(0.72 0.12 185)",
                    color: "oklch(0.15 0.04 240)",
                  }}
                >
                  Myytävät laitteet
                </button>
              </Link>
              <Link to="/admin" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 min-h-[48px]"
                  style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
                >
                  Admin
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {content?.operatorPhoto ? (
              <img
                src={content.operatorPhoto.getDirectURL()}
                alt="Operator"
                className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full object-cover mx-auto"
                style={{ border: "3px solid oklch(0.72 0.12 185)" }}
              />
            ) : (
              <div
                className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center mx-auto"
                style={{
                  border: "2px dashed oklch(0.72 0.12 185 / 0.4)",
                  background: "oklch(0.25 0.04 240)",
                }}
              >
                <svg
                  aria-hidden="true"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <circle
                    cx="24"
                    cy="18"
                    r="8"
                    stroke="oklch(0.72 0.12 185)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M8 40 Q8 30 24 30 Q40 30 40 40"
                    stroke="oklch(0.72 0.12 185)"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                <p
                  className="text-xs mt-2 text-center px-4"
                  style={{ color: "oklch(0.60 0.04 230)" }}
                >
                  Lisää kuva admin-sivulla
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section
        className="relative w-full overflow-hidden"
        style={{ background: "oklch(0.19 0.05 240)" }}
      >
        <div className="absolute left-0 top-0 w-1/2 opacity-40">
          <WaveformSVG />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-sm" style={{ color: "oklch(0.72 0.12 185)" }}>
              Operator: {operatorName} (HB9FDL / OH6KNW)
            </p>
            <h3 className="text-xl font-bold text-white mt-1 mb-1 tracking-widest uppercase">
              My Story:
            </h3>
            <p
              className="text-base font-semibold mb-3"
              style={{ color: "oklch(0.80 0.04 220)" }}
            >
              A Lifelong Passion for Radio
            </p>

            {isLoading ? (
              <div
                className="h-20 rounded"
                style={{ background: "oklch(0.25 0.04 240)" }}
              />
            ) : content?.storyText ? (
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "oklch(0.78 0.02 230)" }}
              >
                {content.storyText}
              </p>
            ) : (
              <p
                className="text-sm italic mb-6"
                style={{ color: "oklch(0.55 0.02 230)" }}
              >
                Lisää tarinasi admin-sivulla
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section
        className="w-full py-10 md:py-14"
        style={{ background: "oklch(0.28 0.07 175)", minHeight: "200px" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center">
          {secondPhoto ? (
            <motion.img
              src={secondPhoto}
              alt="Etusivun toinen kuva"
              className="rounded-xl object-cover w-full"
              style={{ maxHeight: "300px", maxWidth: "100%" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-xl px-8 sm:px-12 py-10"
              style={{
                border: "2px dashed oklch(0.72 0.12 185 / 0.4)",
                background: "oklch(0.25 0.06 175 / 0.3)",
              }}
            >
              <svg
                aria-hidden="true"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="mb-3"
              >
                <rect
                  x="4"
                  y="10"
                  width="40"
                  height="30"
                  rx="4"
                  stroke="oklch(0.72 0.12 185)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
                <circle
                  cx="16"
                  cy="20"
                  r="4"
                  stroke="oklch(0.72 0.12 185)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M4 32 L14 22 L22 30 L30 22 L44 36"
                  stroke="oklch(0.72 0.12 185)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
              <p className="text-sm" style={{ color: "oklch(0.72 0.12 185)" }}>
                Lisää kuva admin-sivulla
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="flex-1" />
      {visitorCount !== undefined && (
        <div className="flex justify-center pb-2">
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              color: "oklch(0.72 0.12 185)",
              background: "oklch(0.20 0.04 240 / 0.6)",
              border: "1px solid oklch(0.35 0.08 185 / 0.4)",
            }}
            data-ocid="homepage.visitor_count"
          >
            Kävijöitä: {visitorCount.toString()}
          </span>
        </div>
      )}
      <Footer />
    </div>
  );
}
