import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { EquipmentItem } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useItems } from "../hooks/useQueries";

const DEFAULT_CATEGORY = "HF-Radiot";

function getCategories(): string[] {
  try {
    const stored = localStorage.getItem("hf_categories");
    if (stored) return JSON.parse(stored) as string[];
  } catch {}
  const initial = [DEFAULT_CATEGORY];
  localStorage.setItem("hf_categories", JSON.stringify(initial));
  return initial;
}

function getItemCategory(id: bigint): string {
  return localStorage.getItem(`hf_item_category_${id}`) ?? DEFAULT_CATEGORY;
}

// Lightbox modal
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.88)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.img
          src={src}
          alt="Zoomed"
          className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
          style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors"
          style={{
            background: "oklch(0.28 0.04 240 / 0.9)",
            border: "1px solid oklch(0.45 0.06 240)",
            minWidth: "48px",
            minHeight: "48px",
          }}
          aria-label="Sulje"
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function EquipmentCard({
  item,
  index,
}: {
  item: EquipmentItem;
  index: number;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(
    item.mainPhoto?.getDirectURL() ?? null,
  );
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const allThumbs = [
    ...(item.mainPhoto ? [item.mainPhoto.getDirectURL()] : []),
    ...item.subPhotos.map((p) => p.getDirectURL()),
  ];

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
      <motion.div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "oklch(0.20 0.055 240)",
          border: "1px solid oklch(0.32 0.05 240)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        data-ocid={`equipment.item.${index + 1}`}
      >
        {/* Main photo area -- clickable to zoom */}
        <div
          className="w-full relative overflow-hidden"
          style={{ height: "220px", background: "oklch(0.17 0.05 240)" }}
        >
          {selectedPhoto ? (
            <button
              type="button"
              className="w-full h-full p-0 border-0 bg-transparent cursor-zoom-in block"
              onClick={() => setLightboxSrc(selectedPhoto)}
              aria-label="Suurenna kuva"
            >
              <img
                src={selectedPhoto}
                alt={item.itemNumber}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {/* Zoom hint overlay */}
              <div
                className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs flex items-center gap-1 opacity-80"
                style={{
                  background: "oklch(0.12 0.04 240 / 0.75)",
                  color: "oklch(0.80 0.08 200)",
                  pointerEvents: "none",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="5"
                    cy="5"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M8 8 L11 11"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 3.5 V6.5 M3.5 5 H6.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
                Suurenna
              </div>
            </button>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                aria-hidden="true"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="opacity-25"
              >
                <rect
                  x="4"
                  y="8"
                  width="40"
                  height="32"
                  rx="4"
                  stroke="oklch(0.72 0.12 185)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="16"
                  cy="20"
                  r="4"
                  stroke="oklch(0.72 0.12 185)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M4 36 L14 26 L22 33 L30 27 L44 36"
                  stroke="oklch(0.72 0.12 185)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          )}
          {/* Item number badge */}
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-mono font-bold"
            style={{
              background: "oklch(0.15 0.055 240 / 0.85)",
              color: "oklch(0.72 0.12 185)",
              border: "1px solid oklch(0.35 0.04 240 / 0.6)",
              pointerEvents: "none",
            }}
          >
            {item.itemNumber}
          </div>
        </div>

        {/* Sub-photo thumbnails */}
        {allThumbs.length > 1 && (
          <div
            className="flex gap-2 px-3 py-2 overflow-x-auto"
            style={{
              borderBottom: "1px solid oklch(0.28 0.04 240)",
              scrollbarWidth: "none",
            }}
          >
            {allThumbs.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelectedPhoto(src)}
                className="flex-shrink-0 rounded overflow-hidden transition-all duration-150"
                style={{
                  width: "52px",
                  height: "52px",
                  minWidth: "52px",
                  minHeight: "52px",
                  border:
                    selectedPhoto === src
                      ? "2px solid oklch(0.65 0.18 40)"
                      : "2px solid transparent",
                  outline:
                    selectedPhoto === src
                      ? "1px solid oklch(0.65 0.18 40 / 0.4)"
                      : "none",
                }}
                aria-label={`Näytä kuva ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 p-4 flex flex-col gap-2">
          <p className="text-white text-sm leading-relaxed flex-1 break-words">
            {item.description}
          </p>
          <div
            className="flex items-center justify-between pt-2"
            style={{ borderTop: "1px solid oklch(0.28 0.04 240)" }}
          >
            <span className="text-xs" style={{ color: "oklch(0.55 0.03 230)" }}>
              {allThumbs.length > 0
                ? `${allThumbs.length} kuva${allThumbs.length !== 1 ? "a" : ""}`
                : "Ei kuvia"}
            </span>
            <span
              className="text-xl font-bold"
              style={{ color: "oklch(0.65 0.18 40)" }}
            >
              {item.price} €
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function EquipmentPage() {
  const { data: items, isLoading } = useItems();
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);

  // Count items per category
  const countByCategory = (cat: string) =>
    items?.filter((item) => getItemCategory(item.id) === cat).length ?? 0;

  const filteredItems = items?.filter(
    (item) => getItemCategory(item.id) === selectedCategory,
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.22 0.055 240)" }}
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center tracking-widest uppercase mb-2"
            style={{ color: "white" }}
          >
            Myytävät laitteet
          </h1>
          <div
            className="w-20 h-1 rounded mx-auto mb-8 md:mb-10"
            style={{ background: "oklch(0.65 0.18 40)" }}
          />
        </motion.div>

        {/* Mobile: horizontal category scroll with fade edges */}
        <div className="relative md:hidden mb-6">
          <div
            className="flex gap-2 overflow-x-auto pb-3"
            style={
              {
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties
            }
            data-ocid="equipment.tab"
          >
            {categories.map((cat) => {
              const count = countByCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 min-h-[44px]"
                  style={{
                    background:
                      selectedCategory === cat
                        ? "oklch(0.65 0.18 40)"
                        : "oklch(0.18 0.05 240)",
                    color:
                      selectedCategory === cat
                        ? "white"
                        : "oklch(0.72 0.12 185)",
                    border:
                      selectedCategory === cat
                        ? "1px solid oklch(0.65 0.18 40)"
                        : "1px solid oklch(0.32 0.05 240)",
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-3 w-4 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, oklch(0.22 0.055 240), transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-3 w-8 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, oklch(0.22 0.055 240), transparent)",
            }}
          />
        </div>

        {/* Desktop: sidebar + grid layout */}
        <div className="flex gap-6">
          {/* Left sidebar categories (desktop only) */}
          <aside
            className="hidden md:flex flex-col flex-shrink-0"
            style={{ width: "200px" }}
          >
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.18 0.05 240)",
                border: "1px solid oklch(0.30 0.05 240)",
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="px-4 py-3"
                style={{
                  borderBottom: "1px solid oklch(0.28 0.05 240)",
                  background: "oklch(0.16 0.06 240)",
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "oklch(0.72 0.12 185)" }}
                >
                  Kategoriat
                </span>
              </div>
              <nav className="flex flex-col py-2" data-ocid="equipment.tab">
                {categories.map((cat) => {
                  const count = countByCategory(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 relative"
                      style={{
                        background:
                          selectedCategory === cat
                            ? "oklch(0.65 0.18 40 / 0.18)"
                            : "transparent",
                        color:
                          selectedCategory === cat
                            ? "oklch(0.82 0.14 40)"
                            : "oklch(0.72 0.08 230)",
                        borderLeft:
                          selectedCategory === cat
                            ? "3px solid oklch(0.65 0.18 40)"
                            : "3px solid transparent",
                      }}
                    >
                      <span className="truncate block pr-1">
                        {cat}{" "}
                        <span
                          style={{
                            color:
                              selectedCategory === cat
                                ? "oklch(0.70 0.12 40)"
                                : "oklch(0.55 0.05 220)",
                            fontSize: "0.75em",
                          }}
                        >
                          ({count})
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </aside>

          {/* Equipment grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                data-ocid="equipment.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-72 w-full rounded-2xl"
                    style={{ background: "oklch(0.28 0.05 240)" }}
                  />
                ))}
              </div>
            ) : !filteredItems || filteredItems.length === 0 ? (
              <div
                className="text-center py-16 sm:py-20"
                data-ocid="equipment.empty_state"
              >
                <svg
                  aria-hidden="true"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  className="mx-auto mb-4 opacity-30"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="20"
                    stroke="oklch(0.72 0.12 185)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M20 32 Q32 18 44 32 Q32 46 20 32"
                    stroke="oklch(0.72 0.12 185)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                <p
                  className="text-lg"
                  style={{ color: "oklch(0.60 0.03 230)" }}
                >
                  Ei laitteita tässä kategoriassa.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                data-ocid="equipment.table"
              >
                {filteredItems.map((item, idx) => (
                  <EquipmentCard
                    key={String(item.id)}
                    item={item}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
