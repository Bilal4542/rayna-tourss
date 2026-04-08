import { useEffect, useState } from "react";
import { apiService } from "../api";

const toSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const extractCloudinaryPublicId = (url = "") => {
  try {
    const cleanUrl = url.split("?")[0];
    const marker = "/upload/";
    const markerIndex = cleanUrl.indexOf(marker);
    if (markerIndex === -1) return "";
    const filePath = cleanUrl.slice(markerIndex + marker.length);
    const withoutVersion = filePath.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return "";
  }
};

const makeBannerSlot = (slot = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  url: slot.url || "",
  publicId: slot.publicId || "",
  file: slot.file || null,
  isLocal: Boolean(slot.file),
});

const ResourceSection = ({ title, resourcePath, enableBanner = false }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [bannerSlots, setBannerSlots] = useState([makeBannerSlot()]);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await apiService.listResource(resourcePath));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setBannerSlots([makeBannerSlot()]);
    setSubmitting(false);
    setEditingId(null);
  };

  const ensureTrailingEmptySlot = (slots) => {
    const filtered = slots.filter((slot, idx) => {
      if (slot.url || slot.file) return true;
      return idx === slots.length - 1;
    });
    if (filtered.length === 0 || filtered[filtered.length - 1].url) {
      filtered.push(makeBannerSlot());
    }
    return filtered;
  };

  const normalizeBannerValues = (item) => {
    const rawBanners = Array.isArray(item?.banners)
      ? item.banners
      : item?.banner
      ? [item.banner]
      : [];

    return rawBanners
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object") return entry.url || entry.secure_url || "";
        return "";
      })
      .map((url) => String(url || "").trim())
      .filter(Boolean);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase() || toSlug(name),
      };

      if (enableBanner) {
        const filledSlots = bannerSlots.filter((slot) => slot.url || slot.file);
        const keptRemoteUrls = filledSlots
          .filter((slot) => !slot.file && slot.url && !String(slot.url).startsWith("blob:"))
          .map((slot) => String(slot.url).trim())
          .filter(Boolean);

        const localFiles = filledSlots.filter(
          (slot) => slot.file && (slot.file instanceof File || slot.file instanceof Blob)
        );
        const uploadedResults = await Promise.all(
          localFiles.map((slot) => apiService.uploadImage(slot.file))
        );
        const uploadedUrls = uploadedResults
          .map((result) => result?.url)
          .map((url) => (typeof url === "string" ? url.trim() : ""))
          .filter(Boolean);

        if (localFiles.length !== uploadedUrls.length) {
          throw new Error("One or more banner uploads failed. Please try again.");
        }

        payload.banners = [...keptRemoteUrls, ...uploadedUrls].filter(Boolean);
      }

      if (editingId) {
        await apiService.updateResource(resourcePath, editingId, payload);
      } else {
        await apiService.createResource(resourcePath, payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setName(item.name || "");
    setSlug(item.slug || "");

    const bannerUrls = normalizeBannerValues(item);
    const slots = bannerUrls.map((url) =>
      makeBannerSlot({
        url,
        publicId: extractCloudinaryPublicId(url),
      })
    );
    setBannerSlots(ensureTrailingEmptySlot(slots));
  };

  const onSelectBanner = (slotId, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    const localUrl = URL.createObjectURL(file);
    setBannerSlots((prev) => {
      const next = prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              url: localUrl,
              file,
              isLocal: true,
            }
          : slot
      );
      return ensureTrailingEmptySlot(next);
    });
  };

  const onRemoveBanner = (slotId) => {
    setBannerSlots((prev) => {
      const next = prev.filter((slot) => slot.id !== slotId);
      return ensureTrailingEmptySlot(next);
    });
  };

  const onDelete = async (id) => {
    setError("");
    if (!window.confirm("Delete this item?")) return;
    try {
      await apiService.deleteResource(resourcePath, id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
        <div className="flex gap-2">
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button className="btn-secondary" type="button" onClick={resetForm}>Cancel</button>
          )}
        </div>
        {enableBanner && (
          <div className="sm:col-span-3">
            <p className="mb-2 text-sm font-medium text-surface-700">Banners</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {bannerSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-surface-300 bg-surface-50"
                >
                  {slot.url ? (
                    <>
                      <img
                        src={slot.url}
                        alt="Banner"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                        onClick={() => onRemoveBanner(slot.id)}
                        disabled={submitting}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <label className="flex h-full cursor-pointer flex-col items-center justify-center px-2 text-center text-xs text-surface-500">
                      Upload banner
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onSelectBanner(slot.id, e.target.files?.[0])}
                        disabled={submitting}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 overflow-auto rounded-lg border border-surface-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-surface-50 text-left text-surface-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              {enableBanner && <th className="px-4 py-3">Banner</th>}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-surface-500" colSpan={enableBanner ? 4 : 3}>No records found.</td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item._id} className="border-t border-surface-100">
                <td className="px-4 py-3 font-medium text-surface-900">{item.name}</td>
                <td className="px-4 py-3 text-surface-600">{item.slug}</td>
                {enableBanner && (
                  <td className="px-4 py-3">
                    {item.banners?.[0] ? (
                      <img
                        src={item.banners[0]}
                        alt="Banner"
                        className="h-10 w-16 rounded object-cover"
                      />
                    ) : (
                      <span className="text-xs text-surface-400">-</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-secondary !px-3 !py-1" onClick={() => onEdit(item)} type="button">Edit</button>
                    <button className="btn-secondary !px-3 !py-1 text-red-600" onClick={() => onDelete(item._id)} type="button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ResourceSection;
