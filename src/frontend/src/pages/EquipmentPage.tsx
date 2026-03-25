import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useItems } from "../hooks/useQueries";

export default function EquipmentPage() {
  const { data: items, isLoading } = useItems();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.22 0.055 240)" }}
    >
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
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
          <div className="space-y-4" data-ocid="equipment.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-20 w-full rounded-lg"
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
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid oklch(0.35 0.04 240)" }}
            data-ocid="equipment.table"
          >
            <div
              className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest"
              style={{
                background: "oklch(0.18 0.055 240)",
                color: "oklch(0.72 0.12 185)",
              }}
            >
              <div className="col-span-2">#</div>
              <div className="col-span-1">Photo</div>
              <div className="col-span-7">Description</div>
              <div className="col-span-2 text-right">Price</div>
            </div>

            {items.map((item, idx) => (
              <motion.div
                key={String(item.id)}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center"
                style={{
                  background:
                    idx % 2 === 0
                      ? "oklch(0.24 0.05 240)"
                      : "oklch(0.22 0.05 240)",
                  borderTop: "1px solid oklch(0.30 0.04 240)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`equipment.item.${idx + 1}`}
              >
                <div className="col-span-2">
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-mono font-bold"
                    style={{
                      background: "oklch(0.72 0.12 185 / 0.15)",
                      color: "oklch(0.72 0.12 185)",
                    }}
                  >
                    {item.itemNumber}
                  </span>
                </div>
                <div className="col-span-1">
                  {item.photo ? (
                    <img
                      src={item.photo.getDirectURL()}
                      alt={item.itemNumber}
                      className="w-14 h-14 rounded-lg object-cover"
                      style={{ border: "1px solid oklch(0.35 0.04 240)" }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{
                        background: "oklch(0.28 0.05 240)",
                        border: "1px dashed oklch(0.40 0.04 240)",
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="4"
                          width="16"
                          height="12"
                          rx="2"
                          stroke="oklch(0.50 0.04 230)"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <circle
                          cx="7"
                          cy="8"
                          r="1.5"
                          stroke="oklch(0.50 0.04 230)"
                          strokeWidth="1"
                          fill="none"
                        />
                        <path
                          d="M2 14 L6 10 L10 13 L13 11 L18 14"
                          stroke="oklch(0.50 0.04 230)"
                          strokeWidth="1"
                          fill="none"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="col-span-7">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "oklch(0.65 0.18 40)" }}
                  >
                    {item.price} €
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
