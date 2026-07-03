import { useEffect, useState } from "react";
export default function Dashboard() {
  interface Closet {
    id: number;
    userId: number;
    fileName: string;
    mimeType: string;
    image: string;
  }
  interface Outfit {
    id: number;
    userId: number;
    name: string;
    description: string;
    closetIds: number[];
    closetItems: Closet[];
  }
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [closets, setCloset] = useState<Closet[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [selectedClosetIds, setSelectedClosetIds] = useState<number[]>([]);
  const [outfitName, setOutfitName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editClosetIds, setEditClosetIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetchOutfits();
  }, []);
  useEffect(() => {
    fetchCloset();
  }, []);

  const fetchOutfits = async () => {
    const res = await fetch("/api/outfits", {
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Couldn't fetch outfits");
      return;
    }

    const data = await res.json();
    console.log(data);
    setOutfits(data.outfits);
    console.log(data);
  };

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
  const openOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setEditClosetIds(outfit.closetIds);
    setIsEditing(false);
  };

  // Deterministic "randomness" so each item's scatter position/rotation
  // stays stable across re-renders instead of jumping around.
  const scatterSeed = (id) => {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000;
    }
    return hash;
  };

  const toggleClosetItem = (id: number) => {
    setEditClosetIds((prev) =>
      prev.includes(id) ? prev.filter((closetId) => closetId !== id) : [...prev, id],
    );
  };
  const saveOutfit = async () => {
    if (!selectedOutfit) return;
    setSaving(true);
    const res = await fetch(`/api/outfits/${selectedOutfit.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({closetIds: editClosetIds}),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      alert(data.message);
      return;
    }
    setOutfits((prev) =>
      prev.map((outfit) =>
        outfit.id === selectedOutfit.id ? data.outfit : outfit))
  ;
    setSelectedOutfit(data.outfit);
    setIsEditing(false);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a2e] via-[#0d1b6e] to-[#0a0a2e] text-white font-sans">
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
      {/* {selectedOutfit && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedOutfit(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // prevents backdrop click from closing when clicking inside
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{selectedOutfit.name}</h2>
              <button
                onClick={() => setSelectedOutfit(null)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {selectedOutfit.description && (
              <p className="text-sm text-gray-500 mb-4">
                {selectedOutfit.description}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedOutfit.closetItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.fileName}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
      {selectedOutfit && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setSelectedOutfit(null)}
  >
    <div
      className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{selectedOutfit.name}</h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-sm text-blue-500"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button onClick={() => setSelectedOutfit(null)} className="text-xl">
            ✕
          </button>
        </div>
      </div>

      {selectedOutfit.description && (
        <p className="text-sm text-gray-500 mb-4">{selectedOutfit.description}</p>
      )}

      {!isEditing ? (
        // VIEW MODE
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {selectedOutfit.closetItems.map((item) => (
            <div key={item.id} className="border rounded-md overflow-hidden">
              <img src={item.image} alt={item.fileName} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
      ) : (
        // EDIT MODE — show ALL closet items, checked if selected
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {closets.map((item) => {
              const included = editClosetIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleClosetItem(item.id)}
                  className={`relative border rounded-md overflow-hidden cursor-pointer ${
                    included ? "ring-2 ring-blue-500" : "opacity-50"
                  }`}
                >
                  <img src={item.image} alt={item.fileName} className="w-full h-32 object-cover" />
                  {included && (
                    <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={saveOutfit}
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 rounded-md disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  </div>
)}

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <section className="mb-12">
          <h1 className="text-2xl font-semibold mb-6">My outfits</h1>

          {outfits.length === 0 && (
            <p className="text-sm text-white/60">
              No outfits yet — create one from your closet items.
            </p>
          )}

          <div className="flex flex-col gap-8">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => setSelectedOutfit(outfit)}
                className="cursor-pointer rounded-lg p-3 hover:shadow-md transition"
              >
                <h2 className="text-base font-medium mb-3">{outfit.name}</h2>

                <div className="flex flex-wrap items-end pt-4 pb-2">
                  {outfit.closetItems.map((item, i) => {
                    const seed = scatterSeed(item.id) + i * 7;
                    const rotate = (seed % 21) - 10; // -10deg to 10deg
                    const lift = (seed % 17) - 8; // -8px to 8px
                    return (
                      <div
                        key={item.id}
                        style={{
                          transform: `rotate(${rotate}deg) translateY(${lift}px)`,
                          zIndex: i,
                          marginLeft: i === 0 ? 0 : "-4.75rem",
                        }}
                        className="relative w-24 sm:w-28 shrink-0 bg-white p-1.5 pb-3 rounded-sm shadow-lg transition-transform duration-200 hover:-translate-y-2 hover:rotate-0 hover:z-40"
                      >
                        <div className="aspect-square overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Closet</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {closets.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCloset(item.id)}
                className={`aspect-square rounded-lg overflow-hidden bg-white/5 ${
                  selectedClosetIds.includes(item.id)
                    ? "ring-4 ring-blue-500"
                    : ""
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
        </section>
      </div>
    </div>
  );
}
