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
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddItem,
  useClaimFirstAdmin,
  useDeleteItem,
  useGetNextItemId,
  useHomepageContent,
  useIsAdmin,
  useItems,
  useSetHomepageContent,
  useUpdateItem,
} from "../hooks/useQueries";

function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div
      className="flex-1 flex items-center justify-center"
      data-ocid="admin.dialog"
    >
      <motion.div
        className="text-center p-10 rounded-2xl max-w-md w-full"
        style={{
          background: "oklch(0.22 0.055 240)",
          border: "1px solid oklch(0.35 0.04 240)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <svg
          aria-hidden="true"
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          className="mx-auto mb-4"
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="oklch(0.72 0.12 185)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M20 20 Q20 12 28 12 Q36 12 36 20 L36 26 L20 26 Z"
            stroke="oklch(0.72 0.12 185)"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="18"
            y="26"
            width="20"
            height="16"
            rx="3"
            stroke="oklch(0.72 0.12 185)"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="28" cy="34" r="2" fill="oklch(0.72 0.12 185)" />
        </svg>
        <h2 className="text-xl font-bold text-white mb-2">
          Admin-kirjautuminen
        </h2>
        <p className="text-sm mb-6" style={{ color: "oklch(0.65 0.03 230)" }}>
          Kirjaudu sisään hallinnoidaksesi sivustoa.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full py-3 font-semibold"
          style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
          data-ocid="admin.submit_button"
        >
          {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoggingIn ? "Kirjaudutaan..." : "Kirjaudu sisään"}
        </Button>
      </motion.div>
    </div>
  );
}

function ClaimAdminPrompt() {
  const { mutateAsync: claimAdmin, isPending } = useClaimFirstAdmin();
  const { clear } = useInternetIdentity();

  const handleClaim = async () => {
    try {
      const success = await claimAdmin();
      if (!success) {
        toast.error("Admin-oikeudet on jo myönnetty toiselle käyttäjälle.");
      }
    } catch {
      toast.error("Virhe admin-oikeuksien hakemisessa.");
    }
  };

  return (
    <div
      className="flex-1 flex items-center justify-center"
      data-ocid="admin.dialog"
    >
      <motion.div
        className="text-center p-10 rounded-2xl max-w-md w-full"
        style={{
          background: "oklch(0.22 0.055 240)",
          border: "1px solid oklch(0.35 0.04 240)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-xl font-bold text-white mb-2">
          Aktivoi admin-oikeudet
        </h2>
        <p className="text-sm mb-6" style={{ color: "oklch(0.65 0.03 230)" }}>
          Olet kirjautunut sisään, mutta sinulla ei ole vielä admin-oikeuksia.
          Klikkaa alla olevaa painiketta aktivoidaksesi ne.
        </p>
        <Button
          onClick={handleClaim}
          disabled={isPending}
          className="w-full py-3 font-semibold mb-3"
          style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
          data-ocid="admin.submit_button"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Aktivoidaan..." : "Aktivoi admin-oikeudet"}
        </Button>
        <Button
          onClick={clear}
          variant="ghost"
          className="w-full text-sm"
          style={{ color: "oklch(0.60 0.03 230)" }}
          data-ocid="admin.cancel_button"
        >
          Kirjaudu ulos
        </Button>
      </motion.div>
    </div>
  );
}

function HomepageContentSection() {
  const { data: content } = useHomepageContent();
  const { mutateAsync: saveContent, isPending } = useSetHomepageContent();
  const [storyText, setStoryText] = useState(content?.storyText ?? "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    content?.photo?.getDirectURL() ?? null,
  );
  const [photoBlob, setPhotoBlob] = useState<ExternalBlob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Operator name (localStorage)
  const [operatorName, setOperatorName] = useState(
    () => localStorage.getItem("operatorName") ?? "Teemu",
  );

  // Second photo (localStorage)
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
      const photo = photoBlob ?? content?.photo ?? undefined;
      await saveContent({ storyText, photo });
      localStorage.setItem("operatorName", operatorName);
      toast.success("Kotisivu tallennettu!");
    } catch {
      toast.error("Tallennus epäonnistui.");
    }
  };

  const triggerPhotoUpload = () => fileInputRef.current?.click();

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
            onClick={triggerPhotoUpload}
            data-ocid="admin.upload_button"
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
            data-ocid="admin.dropzone"
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
              data-ocid="admin.input"
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
              data-ocid="admin.textarea"
            />
          </div>
        </div>
      </div>

      {/* Second photo for front page green section */}
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
            data-ocid="admin.upload_button"
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
          data-ocid="admin.save_button"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Tallennetaan..." : "Tallenna"}
        </Button>
      </div>
    </section>
  );
}

type EditingItem = Partial<EquipmentItem> & { isNew?: boolean };

function EquipmentSection() {
  const { data: items } = useItems();
  const { data: nextId } = useGetNextItemId();
  const { mutateAsync: addItem, isPending: isAdding } = useAddItem();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem();

  const [editing, setEditing] = useState<EditingItem | null>(null);
  const [photoBlob, setPhotoBlob] = useState<ExternalBlob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setEditing({
      isNew: true,
      id: nextId ?? BigInt(1),
      itemNumber: "",
      description: "",
      price: "",
    });
    setPhotoBlob(null);
    setPhotoPreview(null);
  };

  const openEdit = (item: EquipmentItem) => {
    setEditing({ ...item });
    setPhotoBlob(null);
    setPhotoPreview(item.photo?.getDirectURL() ?? null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    setPhotoBlob(blob);
    setPhotoPreview(blob.getDirectURL());
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const photo = photoBlob ?? editing.photo ?? undefined;
      const item: EquipmentItem = {
        id: editing.id ?? BigInt(1),
        itemNumber: editing.itemNumber ?? "",
        description: editing.description ?? "",
        price: editing.price ?? "",
        photo,
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
          data-ocid="admin.primary_button"
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
          data-ocid="admin.modal"
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
                data-ocid="admin.input"
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
                data-ocid="admin.input"
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
                data-ocid="admin.textarea"
              />
            </div>
            <div>
              <Label
                className="text-xs mb-1 block"
                style={{ color: "oklch(0.72 0.12 185)" }}
              >
                Kuva
              </Label>
              <button
                type="button"
                className="w-24 h-24 rounded-lg cursor-pointer relative overflow-hidden"
                style={{
                  border: "2px dashed oklch(0.72 0.12 185 / 0.5)",
                  background: "oklch(0.22 0.05 240)",
                }}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload item photo"
                data-ocid="admin.upload_button"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus
                      className="w-6 h-6"
                      style={{ color: "oklch(0.72 0.12 185)" }}
                    />
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setEditing(null)}
              size="sm"
              data-ocid="admin.cancel_button"
            >
              <X className="w-4 h-4 mr-1" /> Peruuta
            </Button>
            <Button
              onClick={handleSave}
              disabled={isAdding || isUpdating}
              size="sm"
              style={{ background: "oklch(0.65 0.18 40)", color: "white" }}
              data-ocid="admin.confirm_button"
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
            <div className="col-span-1">Kuva</div>
            <div className="col-span-5">Kuvaus</div>
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
              <div className="col-span-1">
                {item.photo ? (
                  <img
                    src={item.photo.getDirectURL()}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded"
                    style={{ background: "oklch(0.28 0.05 240)" }}
                  />
                )}
              </div>
              <div className="col-span-5 text-white line-clamp-1 text-xs">
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
  const { identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isFetching: adminFetching } = useIsAdmin();

  const isChecking = !!identity && (actorFetching || adminFetching);
  const showClaimPrompt = !!identity && !isChecking && isAdmin === false;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.20 0.055 240)" }}
    >
      <Header />

      {!identity ? (
        <LoginPrompt />
      ) : isChecking ? (
        <div
          className="flex-1 flex items-center justify-center"
          data-ocid="admin.loading_state"
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(0.72 0.12 185)" }}
          />
        </div>
      ) : showClaimPrompt ? (
        <ClaimAdminPrompt />
      ) : (
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
      )}

      <Footer />
    </div>
  );
}
