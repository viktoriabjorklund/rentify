import { useState } from "react";
import { useRouter } from "next/router";
import { useYourTools } from "../hooks/tools/useYourTools";
import { useLocationSearch } from "../hooks/location";
import confetti from "canvas-confetti";
import SuccessCheck from "@/components/SuccessCheck";
import { Dialog, DialogButton, DialogButtonGroup } from "@/components/Dialog";

export default function CreateAd() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, createTool } = useYourTools();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [place, setPlace] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Error modal state
  const [errorModal, setErrorModal] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  // Input field error state
  const [fieldErrors, setFieldErrors] = useState<{
    title: boolean;
    price: boolean;
    place: boolean;
  }>({
    title: false,
    price: false,
    place: false,
  });

  // Location autocomplete using ViewModel hook
  const {
    suggestions: locationSuggestions,
    showSuggestions,
    loading: loadingLocations,
    search: searchLocations,
    selectLocation,
    hideExistingSuggestions,
    showExistingSuggestions,
  } = useLocationSearch();

  // Handle file selection + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

  // Helper to build input classes with error state
  const inputClass = (hasError: boolean, extra: string = "") =>
    `rounded-lg px-2 py-1 ${extra} border ${
      hasError ? "border-red-500 ring-1 ring-red-400" : "border-black"
    }`;

  // Helper to open error modal and set field error
  function showError(
    field: "title" | "price" | "place",
    title: string,
    message: string
  ) {
    setFieldErrors((prev) => ({ ...prev, [field]: true }));
    setErrorModal({ open: true, title, message });
  }

  // Handle submit - uses ViewModel hook
  const handleAddItem = async () => {
    if (!user) {
      return showError(
        "title",
        "Not logged in",
        "You must be logged in to create an ad."
      );
    }

    // Explicit field validations with specific messages
    if (!title) {
      return showError("title", "Missing title", "Please enter a title.");
    }

    if (!price) {
      return showError("price", "Missing price", "Please enter a price.");
    }

    if (!place) {
      return showError("place", "Missing location", "Please enter a location.");
    }

    if (!existingLocation(place)) {
      return showError(
        "place",
        "Invalid location",
        "Please enter a valid location."
      );
    }

    try {
      setSubmitting(true);

      // Use service layer to create tool
      await createTool({
        name: title,
        description: description,
        price: Number(price),
        location: place,
        category: category,
        photo: selectedFile || undefined,
      });

      // Stop loading first
      setSubmitting(false);

      // Show success overlay immediately
      setShowSuccess(true);

      // Small delay before confetti
      setTimeout(() => {
        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 100);

      // Wait a bit so user can see the confetti before redirect
      setTimeout(() => {
        router.push("/yourtools");
      }, 1600);
    } catch (err) {
      console.error(err);
      setErrorModal({
        open: true,
        title: "Failed to create ad",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center text-black bg-gray-100">
      <div className="flex flex-col items-center justify-center w-3/4 h-3/4 gap-8">
        <p className="text-4xl text-[#3A7858]">Create Ad</p>

        <div className="flex flex-col gap-12 bg-white p-8 rounded-lg">
          <div className="flex gap-8">
            {/* Image Upload */}
            <div className="basis-1/2 flex items-center justify-center">
              <label className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-84 h-64 object-cover border border-black rounded-lg"
                  />
                ) : (
                  <div className="w-84 h-64 flex items-center justify-center border-2 border-dashed border-black rounded-lg bg-gray-50 hover:bg-gray-100">
                    <p>Click to upload</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form */}
            <div className="basis-1/2 flex flex-col gap-4 p-4">
              <div className="flex gap-2">
                <p>Title:</p>
                <input
                  type="text"
                  className={inputClass(fieldErrors.title)}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (fieldErrors.title)
                      setFieldErrors((p) => ({ ...p, title: false }));
                  }}
                  onFocus={hideExistingSuggestions}
                  aria-invalid={fieldErrors.title}
                />
              </div>

              <div className="flex gap-2">
                <p>Category:</p>
                <select
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onFocus={hideExistingSuggestions}
                >
                  <option value=""></option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>

                <p>Place:</p>
                <div className="relative w-full">
                  <input
                    type="text"
                    className={inputClass(fieldErrors.place, "w-full")}
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
                          className="opacity-25"
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
                    <div className="absolute z-10 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
              </div>

              <div className="flex gap-2">
                <p>Price:</p>
                <input
                  type="text"
                  className={inputClass(fieldErrors.price)}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (fieldErrors.price)
                      setFieldErrors((p) => ({ ...p, price: false }));
                  }}
                  onFocus={hideExistingSuggestions}
                  aria-invalid={fieldErrors.price}
                />
                <p>SEK per day</p>
              </div>

              <div className="flex flex-col gap-2">
                <p>Description:</p>
                <input
                  type="text"
                  className="border border-black rounded-lg px-2 py-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={hideExistingSuggestions}
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex gap-4 justify-end items-center">
            <p className="text-2xl">Add Item</p>
            <button
              className="w-8 h-8 bg-[#3A7858] text-white rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddItem}
              disabled={submitting}
            >
              {submitting ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
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
              ) : (
                "+"
              )}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessCheck
          message="Ad created!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <Dialog
        isOpen={errorModal.open}
        onClose={() => setErrorModal({ ...errorModal, open: false })}
        title={errorModal.title}
      >
        <p className="text-gray-700">{errorModal.message}</p>
        <DialogButtonGroup>
          <DialogButton
            onClick={() => setErrorModal({ ...errorModal, open: false })}
          >
            Close
          </DialogButton>
        </DialogButtonGroup>
      </Dialog>
    </div>
  );
}
