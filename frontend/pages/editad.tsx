import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLocationSearch } from "../hooks/location";
import { displayTool, updateTool, Tool } from "../services/toolService";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


const normalizeCategory = (loc?: string | null) => {
  const v = (loc || "").toLowerCase();
  if (v === "electronics") return "electronics";
  if (v === "furniture") return "furniture";
  if (v === "tools" || v === "tools") return "tools";
  if (v === "") return "";
  return "other";
};


export default function EditAd() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [tool, setTool] = useState<Tool | null>(null);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<{
    title: boolean;
    price: boolean;
    place: boolean;
  }>({
    title: false,
    price: false,
    place: false,
  });
  
    const {
      suggestions: locationSuggestions,
      showSuggestions,
      loading: loadingLocations,
      search: searchLocations,
      selectLocation,
      hideExistingSuggestions,
      showExistingSuggestions,
    } = useLocationSearch();
  
      // Handle place input change
      const handlePlaceChange = (value: string) => {
        setPlace(value);
        setFieldErrors((prev) => ({ ...prev, place: false }));
        searchLocations(value); // Debouncing handled by hook
      };
    
      // Handle location selection
      const handleLocationSelect = (location: any) => {
        selectLocation(location);
        // Format as "City, Kommun" or just "City"
        const locationString = location.kommun
          ? `${location.city}, ${location.kommun}`
          : location.city;
        setPlace(locationString);
        setFieldErrors((prev) => ({ ...prev, place: false }));
      };
    
      // Check existing location
      function existingLocation(maybeLocation: string) {
        if (
          locationSuggestions.length == 1 &&
          locationSuggestions[0].kommun != undefined &&
          maybeLocation.split(", ").length == 2
        ) {
          if (
            maybeLocation.split(", ")[0] == locationSuggestions[0].city &&
            locationSuggestions[0].kommun == maybeLocation.split(", ")[1]
          )
            return true;
        }
        if (
          locationSuggestions.length == 1 &&
          locationSuggestions[0].kommun == undefined
        ) {
          if (maybeLocation == locationSuggestions[0].city) return true;
        }
        return false;
      }

      const inputClass = (hasError: boolean, extra: string = "") =>
        `rounded-lg px-2 py-1 ${extra} border ${
          hasError ? "border-red-500 ring-1 ring-red-400" : "border-black"
        }`;

  // Load tool by id - uses service layer
  useEffect(() => {
    if (!Number.isFinite(id)) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const t = await displayTool(id);
        setTool(t);
        setTitle(t.name || "");
        setPlace(t.location || "");
        setCategory(normalizeCategory(t.category));
        setPrice(t.price != null ? String(t.price) : "");
        setDescription(t.description || "");
        if (t.photoURL) {
          const absolute =
            t.photoURL.startsWith("http")
              ? t.photoURL
              : `${API_BASE}${t.photoURL.startsWith("/") ? "" : "/"}${t.photoURL}`;
          setPreview(absolute);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load tool");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Handle image select + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Save - uses service layer
  const onSave = async () => {
    if (!Number.isFinite(id)) return;
    try {
      setSaving(true);
      setError(null);

      // Use service layer to update tool
      await updateTool(id, {
        name: title,
        description: description,
        price: price ? Number(price) : undefined,
        location: place,
        category: category,
        photo: selectedFile || undefined,
      });

      router.push(`/detailview?id=${id}`);
    } catch (e: any) {
      console.error("PUT error:", e);
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!Number.isFinite(id)) {
    return <div className="p-6 text-red-600">Missing or invalid id in query string.</div>;
  }
  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!tool) return <div className="p-6">Not found.</div>;

  return (
    <div className="flex min-h-screen items-center justify-center text-black bg-gray-100">
      <div className="flex flex-col items-center justify-center w-3/4 gap-8">
        <p className="text-4xl text-[#3A7858] max-[431px]:mt-8">Edit “{tool.name}”</p>

        <div className="flex flex-col gap-12 bg-white p-8 rounded-lg w-full border border-[#174B33] max-[431px]:mb-12">
        <div className="flex gap-8 mt-16 max-[431px]:flex-col max-[431px]:items-stretch">
            {/* Image */}
            <div className="basis-1/2 items-center justify-center flex max-[431px]:basis-auto max-[431px]:w-full max-[431px]:mb-4">
              <label className="cursor-pointer">
                {preview ? (
                  <img
                  src={preview}
                  alt="Preview"
                  className="w-84 h-64 object-cover border border-black rounded-lg max-[431px]:w-full max-[431px]:h-auto"
                  />
                ) : (
                  <div className="w-84 h-64 flex items-center justify-center border-2 border-dashed border-black rounded-lg bg-gray-50 hover:bg-gray-100 max-[431px]:w-full max-[431px]:h-48">
                    <p>Click to upload new image</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Form */}
            <div className="basis-1/2 flex flex-col gap-4 max-[431px]:basis-auto max-[431px]:w-full max-[431px]:text-xs">
              <div className="flex gap-2">
                <p>Title:</p>
                <input
                  type="text"
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex gap-2 text-black">
                <p>Place:</p>
                <input
                    className={inputClass(fieldErrors.place, "w-full relative")}
                    value={place}
                    onChange={(e) => handlePlaceChange(e.target.value)}
                    onFocus={showExistingSuggestions}
                    aria-invalid={fieldErrors.place}
                  />
                  {loadingLocations && (
                    <div className="absolute right-2 top-2 text-gray-400">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25 "
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-1/3 mt-8 ml-13 bg-white border border-black rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {locationSuggestions.map((location) => (
                        <div
                          key={location.place_id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="text-sm font-medium">
                            {location.city}
                          </div>
                          {location.kommun && (
                            <div className="text-xs text-gray-500">
                              {location.kommun}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="flex gap-2">
                <p>Category:</p>
                <select
                  className="border border-black rounded-lg px-2 py-1 w-full max-[1282px]:w-36"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value=""></option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2">
                <p>Price:</p>
                <input
                  type="text"  
                  className="border border-black rounded-lg px-2 py-1 w-full max-[431px]:h-8"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p>SEK per day</p>
              </div>



              <div className="flex flex-col gap-2">
                <p>Description:</p>
                <textarea
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              className="border rounded-lg px-4 py-2 bg-gray-300 text-white cursor-pointer"
              onClick={() => router.push(`/detailview?id=${id}`)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="border rounded-lg px-4 py-2 bg-blue-600 text-white disabled:opacity-60 cursor-pointer"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

