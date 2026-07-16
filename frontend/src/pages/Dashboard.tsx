import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import StarterOutfits from "../components/StarterOutfits";
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
  const [outfitsLoading, setOutfitsLoading] = useState(true);
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
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    suggested_item_ids: string[];
    reasoning: string;
  } | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchTargetItem, setMatchTargetItem] = useState<Closet | null>(null);

  useEffect(() => {
    fetchOutfits();
  }, []);
  useEffect(() => {
    fetchCloset();
  }, []);

  // ... inside your component
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/"); // back to hero/homepage
    }
  };

  const fetchOutfits = async () => {
    try {
      const res = await fetch("/api/outfits", {
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Couldn't fetch outfits");
        return;
      }

      const data = await res.json();
      setOutfits(data.outfits);
    } finally {
      setOutfitsLoading(false);
    }
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
    if (res.ok) {
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

  const scatterSeed = (id: number) => {
    const str = String(id);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000;
    }
    return hash;
  };

  const toggleClosetItem = (id: number) => {
    setEditClosetIds((prev) =>
      prev.includes(id)
        ? prev.filter((closetId) => closetId !== id)
        : [...prev, id],
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
      body: JSON.stringify({ closetIds: editClosetIds }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      alert(data.message);
      return;
    }
    setOutfits((prev) =>
      prev.map((outfit) =>
        outfit.id === selectedOutfit.id ? data.outfit : outfit,
      ),
    );
    setSelectedOutfit(data.outfit);
    setIsEditing(false);
  };

  const matchOutfit = async (id: number) => {
    setMatchLoading(true);

    const target = closets.find((item) => item.id === id) || null;
    setMatchTargetItem(target);

    try {
      const res = await fetch("/api/outfits/suggest", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetItemId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Couldn't generate a match");
        return;
      }
      setMatchResult(data);
      setShowMatchModal(true);
    } catch (err) {
      console.error("Match error:", err);
      alert("Something went wrong generating a match");
    } finally {
      setMatchLoading(false);
    }
  };

  const addMatchToSelection = () => {
    if (!matchTargetItem || !matchResult) return;

    const matchedIds = matchResult.suggested_item_ids.map((id) => Number(id));
    const allIds = [matchTargetItem.id, ...matchedIds];

    setSelectedClosetIds((prev) => Array.from(new Set([...prev, ...allIds])));
    setShowMatchModal(false);
    setMatchTargetItem(null);
    setMatchResult(null);
  };
  const handleDeleteOutfit = async (outfitId: number) => {
    const confirmed = window.confirm(
      "Delete this outfit? This can't be undone.",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/outfits/${outfitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to delete outfit:", response.statusText);
        return;
      }

      // Remove from local state so UI updates without a refetch
      setOutfits((prev) => prev.filter((o) => o.id !== outfitId));

      // Close the detail modal if it's open
      setSelectedOutfit(null); // adjust to whatever your modal's state var is called
    } catch (error) {
      console.error("Error deleting outfit:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#d0cac3] text-white font-sans">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 shadow-sm">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-[#661218]">Closet</span>
          <span className="text-[#661218]">Match</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-3 text-sm">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-full text-[#661218] hover:text-white font-medium border-[#661218] border-2 hover:bg-[#550f14] transition-colors"
          >
            Sign out
          </button>
          <Link to="/closet">
            <button className="px-4 py-2 rounded-full border border-white/20 bg-[#661218] hover:bg-[#550f14] transition-colors">
              My Closet
            </button>
          </Link>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#661218] text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col justify-end items-end px-6 gap-3 pb-5 pt-2 text-sm">
          <Link className=" ml-auto" to="/closet">
            <button className="bg-[#661218] ml:auto hover:bg-[#550f14] transition-colors text-white = text-sm font-medium px-5 py-2 rounded-full">
              My Closet
            </button>
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              setMenuOpen(false);
            }}
            className=" border-2 border-[#661218] ml:auto hover:bg-[#550f14] transition-colors text-[#661218] = text-sm font-medium px-5 py-2 rounded-full"
          >
            Sign out
          </button>
        </div>
      )}

      {/* Floating Add Outfit button — fixed to viewport, stays on scroll */}
      <button
        onClick={() => setShowOutfitModal(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#661218] hover:bg-[#550f14] transition-colors shadow-lg text-sm font-medium flex items-center gap-2"
      >
        + Add Outfit
      </button>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50 px-4">
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
                className="px-4 py-2 text-sm rounded-full bg-[#661218] text-white hover:bg-[#550f14]"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showOutfitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create outfit</h2>

            <input
              type="text"
              placeholder="Outfit name"
              className="border border-gray-300 rounded-lg p-2.5 w-full mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#661218]"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description"
              className="border border-gray-300 rounded-lg p-2.5 w-full mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#661218]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Select clothes
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
              {closets.map((item) => (
                <div key={item.id} className="relative aspect-square group">
                  <button
                    type="button"
                    onClick={() => toggleCloset(item.id)}
                    className={`w-full h-full rounded-lg overflow-hidden border-2 ${
                      selectedClosetIds.includes(item.id)
                        ? "border-[#661218]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      matchOutfit(item.id);
                    }}
                    className="absolute top-1 left-1 bg-[#661218] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    aria-label="Match with closet"
                  >
                    ✨
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOutfitModal(false)}
                className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={createOutfit}
                className="px-4 py-2 text-sm rounded-full bg-[#661218] text-white hover:bg-[#550f14]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {matchLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-[60]">
          <div className="bg-[#550f14] text-white px-6 py-4 rounded-xl shadow-xl text-sm">
            Finding the best match... ✨
          </div>
        </div>
      )}

      {showMatchModal && matchResult && matchTargetItem && (
        <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-60 px-4">
          <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-[#661218] mb-4">
              Suggested match
            </h2>

            <p className="text-xs font-medium text-gray-500 mb-2">
              Selected item
            </p>
            <div className="w-24 aspect-square rounded-lg overflow-hidden mb-4 border-2 border-[#661218] mx-auto">
              <img
                src={matchTargetItem.image}
                alt={matchTargetItem.fileName}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-center text-xs text-gray-400 mb-3">
              pairs well with
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {closets
                .filter((item) =>
                  matchResult.suggested_item_ids.includes(String(item.id)),
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>

            <p className="text-sm text-gray-600 mb-5">
              {matchResult.reasoning}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowMatchModal(false);
                  setMatchTargetItem(null);
                  setMatchResult(null);
                }}
                className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={addMatchToSelection}
                className="px-4 py-2 text-sm rounded-full bg-[#661218] text-white hover:bg-[#550f14]"
              >
                Add to Outfit
              </button>
            </div>
          </div>
        </div>
      )}

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
              <h2 className="text-lg text-[#550f14] font-bold">
                {selectedOutfit.name}
              </h2>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="text-sm text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={() => handleDeleteOutfit(selectedOutfit.id)}
                  className="px-4 py-2 text-sm rounded-full text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {selectedOutfit.description && (
              <p className="text-sm text-gray-800 mb-4">
                {selectedOutfit.description}
              </p>
            )}

            {!isEditing ? (
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
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {closets.map((item) => {
                    const included = editClosetIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleClosetItem(item.id)}
                        className={`relative border rounded-md overflow-hidden cursor-pointer ${
                          included ? "ring-2 ring-[#661218]" : "opacity-50"
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.fileName}
                          className="w-full h-32 object-cover"
                        />
                        {included && (
                          <span className="absolute top-1 right-1 bg-[#661218] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
                  className="w-full bg-[#661218] text-white py-2 rounded-md disabled:opacity-50"
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
          <h1 className="text-2xl font-semibold mb-6 text-[#661218]">
            My outfits
          </h1>

          {!outfitsLoading && outfits.length === 0 && (
            <div>
              <p className="text-sm text-[#551214] mb-6">
                No outfits yet create one from your closet items.
              </p>
              <StarterOutfits
                onSaved={() => {
                  fetchCloset();
                  fetchOutfits();
                }}
              />
            </div>
          )}
          {outfitsLoading && (
            <p className="text-sm text-[#551214]">Loading your outfits…</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                onClick={() => setSelectedOutfit(outfit)}
                className="cursor-pointer rounded-lg p-2 hover:shadow-md transition flex flex-col items-center text-center"
              >
                <h2 className="text-base text-[#661218] font-medium mb-4">
                  {outfit.name}
                </h2>

                <div className="flex  items-end justify-center pt-4 pb-2">
                  {outfit.closetItems.map((item, i) => {
                    const seed = scatterSeed(item.id) + i * 7;
                    const rotate = (seed % 21) - 10;
                    const lift = (seed % 17) - 8;
                    return (
                      <div
                        key={item.id}
                        style={{
                          transform: `rotate(${rotate}deg) translateY(${lift}px)`,
                          zIndex: i,
                          marginLeft: i === 0 ? 0 : "-4.75rem",
                        }}
                        className="relative w-24 sm:w-28 shrink-0 bg-transparent p-1.5 pb-3 rounded-sm border-[#661218] border shadow-lg transition-transform duration-200 hover:-translate-y-2 hover:rotate-0 hover:z-40"
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
      </div>
    </div>
  );
}
