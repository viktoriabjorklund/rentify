import { useState } from "react";
import { useYourTools } from "../hooks/tools/useYourTools";

export default function CreateAd() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const { user, createTool } = useYourTools();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [place, setPlace] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

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

  // Handle submit
// Handle submit
const handleAddItem = async () => {
  if (!user) {
    return alert("You must be logged in");
  }

  try {
    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", place);
    if (selectedFile) formData.append("photo", selectedFile); // 👈 must match upload.single('photo')

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/tools", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create tool");
    }

    alert("Ad created!");
    setTitle("");
    setCategory("");
    setPlace("");
    setPrice("");
    setDescription("");
    setSelectedFile(null);
    setPreview("");
  } catch (err) {
    console.error(err);
    alert("Failed to create ad");
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
                />
              </div>

              <div className="flex gap-2">
                <p>Category:</p>
                <select
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value=""></option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>

                <p>Place:</p>
                <select
                  className="border border-black rounded-lg px-2 py-1 w-full"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                >
                  <option value=""></option>
                  <option value="stockholm">Stockholm</option>
                  <option value="gothenburg">Gothenburg</option>
                  <option value="malmo">Malmö</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2">
                <p>Price:</p>
                <input
                  type="text"
                  className="border border-black rounded-lg px-2 py-1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex gap-4 justify-end items-center">
            <p className="text-2xl">Add Item</p>
            <button
              className="w-8 h-8 bg-[#3A7858] text-white rounded-lg flex items-center justify-center cursor-pointer"
              onClick={handleAddItem}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


  



