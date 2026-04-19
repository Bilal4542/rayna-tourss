import { useEffect, useMemo, useState } from "react";
import { apiService } from "../api";

const makeEmptyImageSlot = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  url: "",
  publicId: "",
  uploading: false,
});

const initialProduct = {
  name: "",
  slug: "",
  category: "",
  city: "",
  cityPoint: "",
  location: "",
  images: [makeEmptyImageSlot()],
  highlights: [{ title: "", description: "" }, { title: "", description: "" }],
  contentSections: [{ title: "", description: "" }, { title: "", description: "" }],
  actualPrice: "",
  discountPrice: "",
  currency: "AED",
  rating: '',
  reviews: '',
  isProductNew: false,
  cruiseLine: "",
  departureCity: "",
  itinerary: "",
  duration: "",
};

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

const ProductSection = ({ categories, cities, cityPoints }) => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(initialProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.name &&
        (form.slug || toSlug(form.name)) &&
        form.category &&
        form.city &&
        form.cityPoint &&
        form.location &&
        form.actualPrice !== ""
      ),
    [form]
  );

  const fetchProducts = async (nextPage = page) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiService.listProducts({ page: nextPage, limit: 10 });
      setProducts(result.items);
      setMeta(result.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm({ ...initialProduct, images: [makeEmptyImageSlot()] });
    setEditingId(null);
  };

  const buildPayload = (images = []) => ({
    name: form.name.trim(),
    slug: (form.slug.trim() || toSlug(form.name)).toLowerCase(),
    category: form.category,
    city: form.city,
    cityPoint: form.cityPoint,
    location: form.location.trim(),
    images,
    highlights: form.highlights
      .filter((h) => h.title || h.description)
      .map((h) => ({ title: h.title, description: h.description })),
    contentSections: form.contentSections
      .filter((c) => c.title || c.description)
      .map((c) => ({ title: c.title, description: c.description })),
    pricing: {
      actualPrice: Number(form.actualPrice),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      currency: form.currency || "AED",
    },
    rating: Number(form.rating),
    reviews: Number(form.reviews),
    isProductNew: !!form.isProductNew,
    cruiseLine: form.cruiseLine?.trim() || undefined,
    departureCity: form.departureCity?.trim() || undefined,
    itinerary: form.itinerary
      ? form.itinerary.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    duration: form.duration?.trim() || undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setImageBusy(true);
    try {
      const filledImageSlots = form.images.filter((slot) => slot.url || slot.file);
      const keptRemoteUrls = filledImageSlots
        .filter(
          (slot) => !slot.file && slot.url && !String(slot.url).startsWith("blob:")
        )
        .map((slot) => String(slot.url).trim())
        .filter(Boolean);

      const localFiles = filledImageSlots.filter(
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
        throw new Error("One or more product image uploads failed. Please try again.");
      }

      const payload = buildPayload([...keptRemoteUrls, ...uploadedUrls]);
      if (editingId) await apiService.updateProduct(editingId, payload);
      else await apiService.createProduct(payload);
      reset();
      fetchProducts(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setImageBusy(false);
    }
  };

  const onEdit = (product) => {
    const imageSlots =
      (product.images || [])
        .map((entry) =>
          typeof entry === "string"
            ? entry
            : entry && typeof entry === "object"
              ? entry.url || entry.secure_url || ""
              : ""
        )
        .map((url) => String(url || "").trim())
        .filter(Boolean)
        .map((url) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url,
          publicId: extractCloudinaryPublicId(url),
          uploading: false,
        })) || [];

    if (imageSlots.length === 0 || imageSlots[imageSlots.length - 1].url) {
      imageSlots.push(makeEmptyImageSlot());
    }

    setEditingId(product._id);
    setForm({
      name: product.name || "",
      slug: product.slug || "",
      category: product.category?._id || "",
      city: product.city?._id || "",
      cityPoint: product.cityPoint?._id || "",
      location: product.location || "",
      images: imageSlots,
      highlights: (product.highlights || []).map((item) => ({ title: item.title, description: item.description })),
      contentSections: (product.contentSections || []).map((item) => ({ title: item.title, description: item.description })),
      actualPrice: product.pricing?.actualPrice ?? "",
      discountPrice: product.pricing?.discountPrice ?? "",
      currency: product.pricing?.currency || "AED",
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isProductNew: !!product.isProductNew,
      cruiseLine: product.cruiseLine || "",
      departureCity: product.departureCity || "",
      itinerary: (product.itinerary || []).join(", "),
      duration: product.duration || "",
    });
  };

  const upsertTrailingEmptySlot = (nextImages) => {
    const cleaned = nextImages.filter(
      (item, idx) =>
        item.url || idx === nextImages.length - 1 || !item.publicId || item.uploading
    );
    if (cleaned.length === 0 || cleaned[cleaned.length - 1].url) {
      cleaned.push(makeEmptyImageSlot());
    }
    return cleaned;
  };

  const onImageSelect = async (slotId, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      images: upsertTrailingEmptySlot(
        prev.images.map((slot) =>
          slot.id === slotId
            ? { ...slot, uploading: false, url: previewUrl, file, publicId: "" }
            : slot
        )
      ),
    }));
  };

  const removeImage = async (slotId) => {
    const slot = form.images.find((item) => item.id === slotId);
    if (!slot) return;

    setError("");
    setImageBusy(true);
    try {
      if (slot.publicId) {
        await apiService.deleteImage(slot.publicId);
      }
      setForm((prev) => {
        const next = prev.images
          .filter((item) => item.id !== slotId)
          .map((item) => ({ ...item, uploading: false }));
        return { ...prev, images: upsertTrailingEmptySlot(next) };
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setImageBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setError("");
    try {
      await apiService.deleteProduct(id);
      fetchProducts(page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold text-surface-900">Products</h2>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <input className="input" placeholder="Product name" value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
        <input className="input" placeholder="Slug (optional)" value={form.slug} onChange={(e) => onChange("slug", e.target.value)} />
        <select className="input" value={form.category} onChange={(e) => onChange("category", e.target.value)} required>
          <option value="">Select category</option>
          {categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
        </select>
        <select className="input" value={form.city} onChange={(e) => onChange("city", e.target.value)} required>
          <option value="">Select city</option>
          {cities.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
        </select>
        <select className="input" value={form.cityPoint} onChange={(e) => onChange("cityPoint", e.target.value)} required>
          <option value="">Select city point</option>
          {cityPoints.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
        </select>
        <input className="input" placeholder="Location" value={form.location} onChange={(e) => onChange("location", e.target.value)} required />
        <input className="input" type="number" placeholder="Actual price" value={form.actualPrice} onChange={(e) => onChange("actualPrice", e.target.value)} required />
        <input className="input" type="number" placeholder="Discount price" value={form.discountPrice} onChange={(e) => onChange("discountPrice", e.target.value)} />
        <input className="input" type="number" step="0.1" max="5" placeholder="Rating (0-5)" value={form.rating} onChange={(e) => onChange("rating", e.target.value)} />
        <input className="input" type="number" placeholder="Review count" value={form.reviews} onChange={(e) => onChange("reviews", e.target.value)} />
        
        <label className="flex items-center gap-2 cursor-pointer p-2 border border-surface-200 rounded-xl bg-surface-50/50">
          <input 
            type="checkbox" 
            checked={form.isProductNew} 
            onChange={(e) => onChange("isProductNew", e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-surface-700">Mark as "New"</span>
        </label>

        {/* Cruise Specific Fields */}
        {categories.find(c => c._id === form.category)?.name?.toLowerCase() === "cruises" && (
          <div className="md:col-span-2 grid gap-3 md:grid-cols-2 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/20">
            <h3 className="md:col-span-2 text-sm font-bold text-blue-700 uppercase tracking-wider">Cruise Details</h3>
            <input className="input border-blue-200 focus:border-blue-500" placeholder="Cruise Line (e.g. MSC, Costa)" value={form.cruiseLine} onChange={(e) => onChange("cruiseLine", e.target.value)} />
            <input className="input border-blue-200 focus:border-blue-500" placeholder="Departure City" value={form.departureCity} onChange={(e) => onChange("departureCity", e.target.value)} />
            <input className="input border-blue-200 focus:border-blue-500" placeholder="Duration (e.g. 7 Nights)" value={form.duration} onChange={(e) => onChange("duration", e.target.value)} />
            <input className="input border-blue-200 focus:border-blue-500" placeholder="Itinerary (Comma separated ports)" value={form.itinerary} onChange={(e) => onChange("itinerary", e.target.value)} />
          </div>
        )}

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-surface-700">Images</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {form.images.map((slot) => (
              <div
                key={slot.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-surface-300 bg-surface-50"
              >
                {slot.url ? (
                  <>
                    <img
                      src={slot.url}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                      onClick={() => removeImage(slot.id)}
                      disabled={imageBusy}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <label className="flex h-full cursor-pointer flex-col items-center justify-center px-2 text-center text-xs text-surface-500">
                    {slot.uploading ? "Uploading..." : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onImageSelect(slot.id, e.target.files?.[0])}
                      disabled={imageBusy || slot.uploading}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-surface-700">Highlights</p>
          {form.highlights.map((h, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
              <input
                className="input"
                placeholder="Title"
                value={h.title}
                onChange={(e) => {
                  const newHighlights = [...form.highlights];
                  newHighlights[idx].title = e.target.value;
                  setForm((prev) => ({ ...prev, highlights: newHighlights }));
                }}
              />
              <textarea
                className="input"
                placeholder="Description"
                value={h.description}
                onChange={(e) => {
                  const newHighlights = [...form.highlights];
                  newHighlights[idx].description = e.target.value;
                  setForm((prev) => ({ ...prev, highlights: newHighlights }));
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setForm((prev) => ({ ...prev, highlights: [...prev.highlights, { title: "", description: "" }] }))}
          >
            Add Highlight
          </button>
        </div>
        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-surface-700">Content Sections</p>
          {form.contentSections.map((c, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
              <input
                className="input"
                placeholder="Title"
                value={c.title}
                onChange={(e) => {
                  const newSections = [...form.contentSections];
                  newSections[idx].title = e.target.value;
                  setForm((prev) => ({ ...prev, contentSections: newSections }));
                }}
              />
              <textarea
                className="input"
                placeholder="Description (rich text)"
                value={c.description}
                onChange={(e) => {
                  const newSections = [...form.contentSections];
                  newSections[idx].description = e.target.value;
                  setForm((prev) => ({ ...prev, contentSections: newSections }));
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setForm((prev) => ({ ...prev, contentSections: [...prev.contentSections, { title: "", description: "" }] }))}
          >
            Add Section
          </button>
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button className="btn-primary" type="submit" disabled={!canSubmit || imageBusy}>{editingId ? "Update Product" : "Create Product"}</button>
          {editingId && <button className="btn-secondary" type="button" onClick={reset}>Cancel</button>}
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-auto rounded-lg border border-surface-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-surface-50 text-left text-surface-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && products.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-surface-500" colSpan={5}>
                  No products found.
                </td>
              </tr>
            )}
            {products.map((item) => (
              <tr key={item._id} className="border-t border-surface-100">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.category?.name || "-"}</td>
                <td className="px-4 py-3">{item.city?.name || "-"}</td>
                <td className="px-4 py-3">
                  {item.pricing?.currency}{" "}
                  {item.pricing?.discountPrice ?? item.pricing?.actualPrice}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary !px-3 !py-1"
                      type="button"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-secondary !px-3 !py-1 text-red-600"
                      type="button"
                      onClick={() => onDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-surface-600">
        <p>
          Page {meta.page || 1} of {meta.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            className="btn-secondary !px-3 !py-1"
            type="button"
            disabled={(meta.page || 1) <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn-secondary !px-3 !py-1"
            type="button"
            disabled={(meta.page || 1) >= (meta.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
