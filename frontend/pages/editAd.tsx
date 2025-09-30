import { useState } from "react";

export default function CreateAd() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

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

  return (
    <div className="flex h-screen items-center justify-center text-black bg-gray-100">
      <div className="flex flex-col items-center justify-center w-3/4 h-3/4 gap-8" id="content">
        <p className="text-4xl text-[#3A7858]">Hammer</p>

        <div className="flex flex-col gap-12 bg-white p-8 rounded-lg">
          <div className="flex gap-8" id="content-1">
            {/* Image Upload */}
            <div className="basis-1/2 items-center justify-center flex">
              <label className="cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-84 h-64 object-cover border border-black rounded-lg"
                  />
                ) : (
                  <div className="w-84 h-64 flex items-center justify-center border-2 border-dashed border-black rounded-lg bg-gray-50 hover:bg-gray-100">
                    <p>Click to upload new image</p>
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
            <div className="basis-1/2 justify-center flex flex-col gap-8 p-4">
              <div className="flex gap-2">
                <p>Title:</p>
                <input type="text" className="border border-black rounded-lg px-2 py-1" />
              </div>

              <div className="flex gap-2">
                <p>Category: </p>
                <select className="border border-black rounded-lg px-2 py-1 w-full">
                  <option value=""></option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="tools">Tools</option>
                  <option value="other">Other</option>
                </select>

                <p>Place: </p>
                <select className="border border-black rounded-lg px-2 py-1 w-full">
                  <option value=""></option>
                  <option value="stockholm">Stockholm</option>
                  <option value="gothenburg">Gothenburg</option>
                  <option value="malmo">Malmö</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-2">
                <p>Price: </p>
                <input type="text" className="border border-black rounded-lg px-2 py-1" />
                <p> SEK per day</p>
              </div>

              <div className="flex flex-col gap-2">
                <p>Description: </p>
                <input type="text" className="border border-black rounded-lg px-2 py-1" />
              </div>
            </div>
          </div>

          {/* Button */}
          <div
              id="content-2"
              className="flex gap-4 justify-end items-center"
            >
                <button className="border rounded-lg w-24 bg-gray-300 text-white">cancel</button>
                <button className="border rounded-lg w-24 bg-blue-500 text-white">save</button>
   
            </div>
        </div>
      </div>
    </div>
  );
}