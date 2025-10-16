import { useState } from "react";
import { useRouter } from "next/router";
import { useYourTools } from "../hooks/tools/useYourTools";
import { useLocationSearch } from "../hooks/location";
import confetti from 'canvas-confetti';

export default function CreateAd() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { user, createTool } = useYourTools();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

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
  const handleLocationChange = (value: string) => {
    setLocation(value);
    searchLocations(value); // Debouncing handled by hook
  };

  // Handle location selection
  const handleLocationSelect = (location: any) => {
    selectLocation(location);
    // Format as "City, Kommun" or just "City"
    const locationString = location.kommun 
      ? `${location.city}, ${location.kommun}` 
      : location.city;
    setLocation(locationString);
  };

  // Check existing location
   function existingLocation(maybeLocation: string){
    if (locationSuggestions.length == 1 && locationSuggestions[0].kommun != undefined && maybeLocation.split(", ").length==2){
      if (maybeLocation.split(", ")[0] == locationSuggestions[0].city && locationSuggestions[0].kommun ==maybeLocation.split(", ")[1]) 
        return true
    }
    if(locationSuggestions.length == 1 && locationSuggestions[0].kommun == undefined){
      if (maybeLocation == locationSuggestions[0].city) 
        return true
    }
    return false
  }

  // Handle submit - uses ViewModel hook
  const handleAddItem = async () => {
    if (!user) {
      return alert("You must be logged in");
    }

    if (!title) {
      return alert("Please enter a title");
    }
    if (!price) {
      return alert("Please enter a price");
    }
    if (!location) {
      return alert("Please enter a location");
    }
    if (!existingLocation(location)) {
      return alert("Please enter a valid location");
    }
    

    try {
      setSubmitting(true);
      
      // Use service layer to create tool
      await createTool({
        name: title,
        description: description,
        price: Number(price),
        location: location,
        category: category,
        photo: selectedFile || undefined,
      });

      // Stop loading first
      setSubmitting(false);
      
      // Small delay before confetti
      setTimeout(() => {
        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 100);
      
      // Wait a bit so user can see the confetti before redirect
      setTimeout(() => {
        router.push('/yourtools');
      }, 1600);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to create ad");
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
                  className="border border-black rounded-lg px-2 py-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={hideExistingSuggestions}
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

                <p>Location:</p>
                <div className="relative w-full">
                  <input
                    type="text"
                    className="border border-black rounded-lg px-2 py-1 w-full"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={showExistingSuggestions}
                  />
                  {loadingLocations && (
                    <div className="absolute right-2 top-2 text-gray-400">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                          <div className="text-sm font-medium">{location.city}</div>
                          {location.kommun && (
                            <div className="text-xs text-gray-500">{location.kommun}</div>
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
                  className="border border-black rounded-lg px-2 py-1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)
                  }onFocus={hideExistingSuggestions}
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
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                '+'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
