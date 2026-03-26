import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import type { EquipmentItem } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useItems } from "../hooks/useQueries";

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

  const allThumbs = [
    ...(item.mainPhoto ? [item.mainPhoto.getDirectURL()] : []),
    ...item.subPhotos.map((p) => p.getDirectURL()),
  ];

  return (
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
      {/* Main photo area */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: "220px", background: "oklch(0.17 0.05 240)" }}
      >
        {selectedPhoto ? (
          <img
            src={selectedPhoto}
            alt={item.itemNumber}
            className="w-full h-full object-cover transition-all duration-300"
          />
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
          }}
        >
          {item.itemNumber}
        </div>
      </div>

      {/* Sub-photo thumbnails */}
      {allThumbs.length > 1 && (
        <div
          className="flex gap-1.5 px-3 py-2"
          style={{ borderBottom: "1px solid oklch(0.28 0.04 240)" }}
        >
          {allThumbs.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelectedPhoto(src)}
              className="flex-shrink-0 rounded overflow-hidden transition-all duration-150"
              style={{
                width: "44px",
                height: "44px",
                border:
                  selectedPhoto === src
                    ? "2px solid oklch(0.65 0.18 40)"
                    : "2px solid transparent",
                outline:
                  selectedPhoto === src
                    ? "1px solid oklch(0.65 0.18 40 / 0.4)"
                    : "none",
              }}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <p className="text-white text-sm leading-relaxed flex-1">
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
  );
}

export default function EquipmentPage() {
  const { data: items, isLoading } = useItems();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.22 0.055 240)" }}
    >
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-3xl md:text-4xl font-bold text-center tracking-widest uppercase mb-2"
            style={{ color: "white" }}
          >
            Myytävät laitteet
          </h1>
          <div
            className="w-20 h-1 rounded mx-auto mb-10"
            style={{ background: "oklch(0.65 0.18 40)" }}
          />
        </motion.div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
        ) : !items || items.length === 0 ? (
          <div className="text-center py-20" data-ocid="equipment.empty_state">
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
            <p className="text-lg" style={{ color: "oklch(0.60 0.03 230)" }}>
              Ei laitteita myynnissä tällä hetkellä.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="equipment.table"
          >
            {items.map((item, idx) => (
              <EquipmentCard key={String(item.id)} item={item} index={idx} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
