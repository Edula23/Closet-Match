import { useEffect, useRef, useState } from "react";
export default function Closet() {
  interface Closet {
    id: number;
    userId: number;
    fileName: string;
    mimeType: string;
    image: string;
  }
  const [todos, setTodos] = useState([]);
  const [closets, setCloset] = useState<Closet[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClosetIds, setSelectedClosetIds] = useState<number[]>([]);
  const [outfitName, setOutfitName] = useState("");
  const [description, setDescription] = useState("");
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [longPressId, setLongPressId] = useState<number | null>(null);
const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchCloset();
  }, []);

  const fetchCloset = async () => {
    const res = await fetch("/api/closet", {
      credentials: "include",
    });
    if (!res.ok) {
      console.log("Couldn't fetch closet");
      return;
    }

    const data = await res.json();
    console.log(data);
    setCloset(data.closets);
  };

  const uploadClothing = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    const res = await fetch("/api/closet", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Upload successful:", data);
      setShowUploadModal(false);
      fetchCloset();
      setSelectedFile(null);
    } else {
      alert(data.message);
    }
  };
  const createOutfit = async () => {
    const res = await fetch("/api/outfits/new", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: outfitName,
        description: description,
        closetIds: selectedClosetIds,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Outfit created:", data);
      fetchOutfits();
      setSelectedClosetIds([]);
      setOutfitName("");
      setDescription("");
      setShowOutfitModal(false);
    }
  };

  const toggleCloset = (id: number) => {
    setSelectedClosetIds((prev) =>
      prev.includes(id)
        ? prev.filter((closetId) => closetId !== id)
        : [...prev, id],
    );
  };
  const startPress = (id: number) => {
  pressTimer.current = setTimeout(() => {
    setLongPressId(id);
  }, 500); // 500ms hold triggers delete mode
};
const cancelPress = () => {
  if (pressTimer.current) {
    clearTimeout(pressTimer.current);
    pressTimer.current = null;
  }
};
const deleteClothing = async (id: number) => {
  const res = await fetch(`/api/closet/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.message);
    return;
  }
    setCloset((prev) => prev.filter((item) => item.id !== id));
  setLongPressId(null);
};


  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a2e] via-[#0d1b6e] to-[#0a0a2e] text-white font-sans">
      <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-white">Closet</span>
          <span className="text-blue-400">Match</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-3 text-sm">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
          >
            + Add Closet
          </button>
          <button
            onClick={() => setShowOutfitModal(true)}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            + Add Outfit
          </button>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-6 pb-5 text-sm">
          <button
            onClick={() => {
              setShowUploadModal(true);
              setMenuOpen(false);
            }}
            className="text-left px-4 py-2 rounded-full border border-white/20"
          >
            + Add Closet
          </button>
          <button
            onClick={() => {
              setShowOutfitModal(true);
              setMenuOpen(false);
            }}
            className="text-left px-4 py-2 rounded-full bg-blue-500"
          >
            + Add Outfit
          </button>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Upload closet item</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
              className="block w-full text-sm mb-5 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={uploadClothing}
                className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showOutfitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create outfit</h2>

            {/* Outfit name */}
            <input
              type="text"
              placeholder="Outfit name"
              className="border border-gray-300 rounded-lg p-2.5 w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
            />

            {/* Description */}
            <input
              type="text"
              placeholder="Description"
              className="border border-gray-300 rounded-lg p-2.5 w-full mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Select clothes
            </h3>

            {/* Closet items selection */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-5">
              {closets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCloset(item.id)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedClosetIds.includes(item.id)
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOutfitModal(false)}
                className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={createOutfit}
                className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <section>
  <h2 className="text-2xl font-semibold mb-6">Closet</h2>
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
    {closets.map((item) => (
      <div key={item.id} className="relative aspect-square group">
        <button
          type="button"
          onClick={() => {
            if (longPressId === item.id) return;
            toggleCloset(item.id);
          }}
          onTouchStart={() => startPress(item.id)}
          onTouchEnd={cancelPress}
          className={`w-full h-full rounded-lg overflow-hidden bg-white/5 `}
        >
          <img
            src={item.image}
            alt={item.fileName}
            className="w-full h-full object-cover"
          />
        </button>

        {/* Desktop: hover-reveal delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteClothing(item.id);
          }}
          className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full items-center justify-center text-xs"
          aria-label="Delete item"
        >
          ✕
        </button>

        {/* Mobile: long-press delete overlay */}
        {longPressId === item.id && (
          <div
            className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg sm:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => deleteClothing(item.id)}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => setLongPressId(null)}
              className="absolute top-1 right-1 text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</section>
      </div>
    </div>
  );
}
