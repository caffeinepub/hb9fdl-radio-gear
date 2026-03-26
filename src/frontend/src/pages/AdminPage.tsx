import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { EquipmentItem } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  useAddItem,
  useDeleteItem,
  useGetNextItemId,
  useHomepageContent,
  useItems,
  useSetHomepageContent,
  useUpdateItem,
} from "../hooks/useQueries";

function HomepageContentSection() {
  const { data: content } = useHomepageContent();
  const { mutateAsync: saveContent, isPending } = useSetHomepageContent();
  const [storyText, setStoryText] = useState(content?.storyText ?? "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    content?.operatorPhoto?.getDirectURL() ?? null,
  );
  const [photoBlob, setPhotoBlob] = useState<ExternalBlob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [operatorName, setOperatorName] = useState(
    () => localStorage.getItem("operatorName") ?? "Teemu",
  );

  const [secondPhotoPreview, setSecondPhotoPreview] = useState<string | null>(
    () => localStorage.getItem("secondPhoto") ?? null,
  );
  const secondPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    setPhotoBlob(blob);
    setPhotoPreview(blob.getDirectURL());
  };

  const handleSecondPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataURL = ev.target?.result as string;
      setSecondPhotoPreview(dataURL);
      localStorage.setItem("secondPhoto", dataURL);
      toast.success("Toinen kuva tallennettu!");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const operatorPhoto = photoBlob ?? content?.operatorPhoto ?? undefined;
      await saveContent({ storyText, operatorPhoto });
      localStorage.setItem("operatorName", operatorName);
      toast.success("Kotisivu tallennettu!");
    } catch {
      toast.error("Tallennus epäonnistui.");
    }
  };

  return (
    <section
      className="rounded-2xl p-6 mb-8"
      style={{
        background: "oklch(0.22 0.055 240)",
        border: "1px solid oklch(0.35 0.04 240)",
      }}
    >
      <h2 className="text-lg font-bold text-white mb-5 tracking-wider uppercase">
        Kotisivu
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Label
            className="text-sm mb-2 block"
            style={{ color: "oklch(0.72 0.12 185)" }}
          >
            Operaattorin kuva
          </Label>
          <button
            type="button"
            className="w-40 h-40 rounded-xl overflow-hidden cursor-pointer relative group"
            style={{
              border: "2px dashed oklch(0.72 0.12 185 / 0.5)",
              background: "oklch(0.26 0.05 240)",
            }}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload operator photo"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Plus
                  className="w-8 h-8"
                  style={{ color: "oklch(0.72 0.12 185)" }}
                />
                <span
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.60 0.03 230)" }}
                >
                  Lisää kuva
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-white">Vaihda kuva</span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div>
            <Label
              className="text-sm mb-2 block"
              style={{ color: "oklch(0.72 0.12 185)" }}
            >
              Operaattorin nimi
            </Label>
            <Input
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="esim. Teemu"
              style={{
                background: "oklch(0.26 0.05 240)",
                border: "1px solid oklch(0.35 0.04 240)",
                color: "white",
              }}
            />
          </div>
          <div>
            <Label
              className="text-sm mb-2 block"
              style={{ color: "oklch(0.72 0.12 185)" }}
            >
              Oma tarina
            </Label>
            <Textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Kerro tarinasi..."
              className="h-28 resize-none text-sm"
              style={{
                background: "oklch(0.26 0.05 240)",
                border: "1px solid oklch(0.35 0.04 240)",
                color: "white",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Label
          className="text-sm mb-2 block"
          style={{ color: "oklch(0.72 0.12 185)" }}
        >
          Toinen kuva (etusivu)
        </Label>
        <div className="flex items-start gap-4">
          <button
            type="button"
            className="w-40 h-32 rounded-xl overflow-hidden cursor-pointer relative group flex-shrink-0"
            style={{
              border: "2px dashed oklch(0.72 0.12 185 / 0.5)",
              background: "oklch(0.26 0.05 240)",
            }}
            onClick={() => secondPhotoInputRef.current?.click()}
            aria-label="Upload second photo"
          >
            {secondPhotoPreview ? (
              <img
                src={secondPhotoPreview}
                alt="Esikatselu"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Plus
                  className="w-8 h-8"
                  style={{ color: "oklch(0.72 0.12 185)" }}
                />
                <span
                  className="text-xs mt-1 text-center px-2"
                  style={{ color: "oklch(0.60 0.03 230)" }}
                >
                  Lisää toinen kuva
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-white">Vaihda kuva</span>
            </div>
          </button>
          <p className="text-xs mt-1" style={{ color: "oklch(0.60 0.03 230)" }}>
            Tämä kuva näkyy etusivun vihreässä osiossa.
            <br />
            Kuva tallennetaan automaattisesti valittaessa.
          </p>
        </div>
        <input
          ref={secondPhotoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSecondPhotoChange}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending}
          style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Tallennetaan..." : "Tallenna"}
        </Button>
      </div>
    </section>
  );
}

type EditingItem = Partial<EquipmentItem> & { isNew?: boolean };

const MAX_SUB_PHOTOS = 5;

function EquipmentSection() {
  const { data: items } = useItems();
  const { data: nextId } = useGetNextItemId();
  const { mutateAsync: addItem, isPending: isAdding } = useAddItem();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem();

  const [editing, setEditing] = useState<EditingItem | null>(null);
  const [mainPhotoBlob, setMainPhotoBlob] = useState<ExternalBlob | null>(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [subPhotoBlobs, setSubPhotoBlobs] = useState<ExternalBlob[]>([]);
  const [subPhotoPreviews, setSubPhotoPreviews] = useState<string[]>([]);
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const subFileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setEditing({
      isNew: true,
      id: nextId ?? BigInt(1),
      itemNumber: "",
      description: "",
      price: "",
      subPhotos: [],
    });
    setMainPhotoBlob(null);
    setMainPhotoPreview(null);
    setSubPhotoBlobs([]);
    setSubPhotoPreviews([]);
  };

  const openEdit = (item: EquipmentItem) => {
    setEditing({ ...item });
    setMainPhotoBlob(null);
    setMainPhotoPreview(item.mainPhoto?.getDirectURL() ?? null);
    setSubPhotoBlobs([]);
    setSubPhotoPreviews(item.subPhotos.map((p) => p.getDirectURL()));
  };

  const handleMainFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    setMainPhotoBlob(blob);
    setMainPhotoPreview(blob.getDirectURL());
  };

  const handleSubFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const existing = subPhotoBlobs.length + (editing?.subPhotos?.length ?? 0);
    const remaining = MAX_SUB_PHOTOS - existing;
    const toProcess = files.slice(0, remaining);
    const newBlobs: ExternalBlob[] = [];
    const newPreviews: string[] = [];
    for (const file of toProcess) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      newBlobs.push(blob);
      newPreviews.push(blob.getDirectURL());
    }
    setSubPhotoBlobs((prev) => [...prev, ...newBlobs]);
    setSubPhotoPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeSubPhoto = (index: number) => {
    const existingCount = editing?.subPhotos?.length ?? 0;
    if (index < existingCount) {
      setEditing((prev) =>
        prev
          ? {
              ...prev,
              subPhotos: prev.subPhotos?.filter((_, i) => i !== index) ?? [],
            }
          : prev,
      );
      setSubPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const blobIndex = index - existingCount;
      setSubPhotoBlobs((prev) => prev.filter((_, i) => i !== blobIndex));
      setSubPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const mainPhoto = mainPhotoBlob ?? editing.mainPhoto ?? undefined;
      const existingSubPhotos = editing.subPhotos ?? [];
      const allSubPhotos = [...existingSubPhotos, ...subPhotoBlobs];
      const item: EquipmentItem = {
        id: editing.id ?? BigInt(1),
        itemNumber: editing.itemNumber ?? "",
        description: editing.description ?? "",
        price: editing.price ?? "",
        mainPhoto,
        subPhotos: allSubPhotos,
      };
      if (editing.isNew) {
        await addItem(item);
        toast.success("Laite lisätty!");
      } else {
        await updateItem(item);
        toast.success("Laite päivitetty!");
      }
      setEditing(null);
    } catch {
      toast.error("Tallennus epäonnistui.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem(id);
      toast.success("Laite poistettu.");
    } catch {
      toast.error("Poistaminen epäonnistui.");
    }
  };

  // Compute combined sub-photo previews for the editing form
  const existingSubPreviews =
    editing?.subPhotos?.map((p) => p.getDirectURL()) ?? [];
  const allSubPreviews = [...existingSubPreviews, ...subPhotoPreviews];
  const totalSubPhotos = allSubPreviews.length;

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        background: "oklch(0.22 0.055 240)",
        border: "1px solid oklch(0.35 0.04 240)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white tracking-wider uppercase">
          Laitteet
        </h2>
        <Button
          onClick={openNew}
          style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
          size="sm"
          data-ocid="equipment.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" /> Lisää laite
        </Button>
      </div>

      {editing && (
        <motion.div
          className="rounded-xl p-5 mb-6"
          style={{
            background: "oklch(0.26 0.06 240)",
            border: "1px solid oklch(0.72 0.12 185 / 0.4)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="equipment.modal"
        >
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
            {editing.isNew ? "Uusi laite" : "Muokkaa laitetta"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.72 0.12 185)" }}
              >
                Laitenumero
              </Label>
              <Input
                value={editing.itemNumber ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, itemNumber: e.target.value } : prev,
                  )
                }
                placeholder="esim. HF-001"
                style={{
                  background: "oklch(0.22 0.05 240)",
                  border: "1px solid oklch(0.35 0.04 240)",
                  color: "white",
                }}
                data-ocid="equipment.input"
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.72 0.12 185)" }}
              >
                Hinta (€)
              </Label>
              <Input
                value={editing.price ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, price: e.target.value } : prev,
                  )
                }
                placeholder="esim. 250"
                style={{
                  background: "oklch(0.22 0.05 240)",
                  border: "1px solid oklch(0.35 0.04 240)",
                  color: "white",
                }}
              />
            </div>
            <div className="md:col-span-2">
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.72 0.12 185)" }}
              >
                Kuvaus
              </Label>
              <Textarea
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev,
                  )
                }
                placeholder="Laitteen kuvaus..."
                className="h-20 resize-none"
                style={{
                  background: "oklch(0.22 0.05 240)",
                  border: "1px solid oklch(0.35 0.04 240)",
                  color: "white",
                }}
                data-ocid="equipment.textarea"
              />
            </div>

            {/* Main photo */}
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.72 0.12 185)" }}
              >
                Pääkuva
              </Label>
              <button
                type="button"
                className="w-28 h-28 rounded-lg cursor-pointer relative overflow-hidden"
                style={{
                  border: "2px dashed oklch(0.72 0.12 185 / 0.5)",
                  background: "oklch(0.22 0.05 240)",
                }}
                onClick={() => mainFileInputRef.current?.click()}
                aria-label="Upload main image"
                data-ocid="equipment.upload_button"
              >
                {mainPhotoPreview ? (
                  <img
                    src={mainPhotoPreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <Plus
                      className="w-6 h-6"
                      style={{ color: "oklch(0.72 0.12 185)" }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.03 230)" }}
                    >
                      Pääkuva
                    </span>
                  </div>
                )}
              </button>
              <input
                ref={mainFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainFileChange}
              />
            </div>

            {/* Sub photos */}
            <div className="md:col-span-2">
              <Label
                className="text-xs mb-2 block"
                style={{ color: "oklch(0.72 0.12 185)" }}
              >
                Lisäkuvat ({totalSubPhotos}/{MAX_SUB_PHOTOS})
              </Label>
              <div className="flex flex-wrap gap-2 items-start">
                {allSubPreviews.map((src, i) => (
                  <div key={src} className="relative w-20 h-20 group">
                    <img
                      src={src}
                      alt={`Lisäkuva ${i + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ border: "1px solid oklch(0.35 0.04 240)" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubPhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "oklch(0.577 0.245 27.325)" }}
                      aria-label="Poista kuva"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {totalSubPhotos < MAX_SUB_PHOTOS && (
                  <button
                    type="button"
                    className="w-20 h-20 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                    style={{
                      border: "2px dashed oklch(0.72 0.12 185 / 0.4)",
                      background: "oklch(0.22 0.05 240)",
                    }}
                    onClick={() => subFileInputRef.current?.click()}
                    aria-label="Add sub image"
                    data-ocid="equipment.dropzone"
                  >
                    <Plus
                      className="w-5 h-5"
                      style={{ color: "oklch(0.72 0.12 185)" }}
                    />
                    <span
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.55 0.03 230)" }}
                    >
                      Lisäkuva
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={subFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleSubFileChange}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setEditing(null)}
              size="sm"
              data-ocid="equipment.cancel_button"
            >
              <X className="w-4 h-4 mr-1" /> Peruuta
            </Button>
            <Button
              onClick={handleSave}
              disabled={isAdding || isUpdating}
              size="sm"
              style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
              data-ocid="equipment.save_button"
            >
              {(isAdding || isUpdating) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Check className="w-4 h-4 mr-1" /> Tallenna
            </Button>
          </div>
        </motion.div>
      )}

      {!items || items.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ background: "oklch(0.25 0.04 240)" }}
          data-ocid="equipment.empty_state"
        >
          <p style={{ color: "oklch(0.60 0.03 230)" }}>
            Ei laitteita. Lisää ensimmäinen laite yllä olevalla painikkeella.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid oklch(0.30 0.04 240)" }}
        >
          <div
            className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "oklch(0.18 0.05 240)",
              color: "oklch(0.72 0.12 185)",
            }}
          >
            <div className="col-span-2">#</div>
            <div className="col-span-2">Kuvat</div>
            <div className="col-span-4">Kuvaus</div>
            <div className="col-span-2">Hinta</div>
            <div className="col-span-2 text-right">Toiminnot</div>
          </div>
          {items.map((item, idx) => (
            <div
              key={String(item.id)}
              className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-sm"
              style={{
                background:
                  idx % 2 === 0
                    ? "oklch(0.24 0.05 240)"
                    : "oklch(0.22 0.05 240)",
                borderTop: "1px solid oklch(0.28 0.04 240)",
              }}
              data-ocid={`equipment.item.${idx + 1}`}
            >
              <div className="col-span-2">
                <span
                  className="font-mono text-xs"
                  style={{ color: "oklch(0.72 0.12 185)" }}
                >
                  {item.itemNumber}
                </span>
              </div>
              <div className="col-span-2 flex gap-1 flex-wrap">
                {item.mainPhoto ? (
                  <img
                    src={item.mainPhoto.getDirectURL()}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                    title="Pääkuva"
                    style={{ border: "2px solid oklch(0.65 0.18 40 / 0.6)" }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded"
                    style={{ background: "oklch(0.28 0.05 240)" }}
                  />
                )}
                {item.subPhotos.slice(0, 2).map((sp, si) => (
                  <img
                    key={sp.getDirectURL()}
                    src={sp.getDirectURL()}
                    alt={`Lisäkuva ${si + 1}`}
                    className="w-10 h-10 rounded object-cover"
                    style={{ border: "1px solid oklch(0.35 0.04 240)" }}
                  />
                ))}
                {item.subPhotos.length > 2 && (
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "oklch(0.28 0.05 240)",
                      color: "oklch(0.72 0.12 185)",
                    }}
                  >
                    +{item.subPhotos.length - 2}
                  </div>
                )}
              </div>
              <div className="col-span-4 text-white line-clamp-1 text-xs">
                {item.description}
              </div>
              <div
                className="col-span-2 font-bold"
                style={{ color: "oklch(0.65 0.18 40)" }}
              >
                {item.price} €
              </div>
              <div className="col-span-2 flex gap-1 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => openEdit(item)}
                  data-ocid={`equipment.edit_button.${idx + 1}`}
                >
                  <Pencil
                    className="w-3 h-3"
                    style={{ color: "oklch(0.72 0.12 185)" }}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting}
                  data-ocid={`equipment.delete_button.${idx + 1}`}
                >
                  <Trash2
                    className="w-3 h-3"
                    style={{ color: "oklch(0.577 0.245 27.325)" }}
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.20 0.055 240)" }}
    >
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-wider uppercase mb-1">
            Admin-paneeli
          </h1>
          <div
            className="w-16 h-0.5 mb-8 rounded"
            style={{ background: "oklch(0.65 0.18 40)" }}
          />
          <HomepageContentSection />
          <EquipmentSection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
