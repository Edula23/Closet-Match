import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
export default function Closet() {
  interface Closet {
    id: number;
    userId: number;
    fileName: string;
    mimeType: string;
    image: string;
  }
  // interface Outfit {
  //   id: number;
  //   userId: number;
  //   name: string;
  //   description: string;
  //   closetIds: number[];
  //   closetItems: Closet[];
  // }
  const [closets, setCloset] = useState<Closet[]>([]);
  // const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClosetIds, setSelectedClosetIds] = useState<number[]>([]);
  const [outfitName, setOutfitName] = useState("");
  const [description, setDescription] = useState("");
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [longPressId, setLongPressId] = useState<number | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    suggested_item_ids: string[];
    reasoning: string;
  } | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchTargetItem, setMatchTargetItem] = useState<Closet | null>(null);
  useEffect(() => {
    fetchCloset();
  }, []);
  // useEffect(() => {
  //   fetchOutfits();
  // }, []);
  //  const fetchOutfits = async () => {
  //   const res = await fetch("/api/outfits", {
  //     credentials: "include",
  //   });

  //   if (!res.ok) {
  //     console.log("Couldn't fetch outfits");
  //     return;
  //   }

  //   const data = await res.json();
  //   console.log(data);
  //   setOutfits(data.outfits);
  //   console.log(data);
  // };
  const navigate = useNavigate();
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
      // fetchOutfits();
      setSelectedClosetIds([]);
      setOutfitName("");
      setDescription("");
      setShowOutfitModal(false);
      setMatchTargetItem(null); // clear leftover match state
      setMatchResult(null);
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
  const matchOutfit = async (id: number) => {
    setMatchLoading(true);
    setLongPressId(null);

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
  const saveMatchAsOutfit = () => {
  if (!matchTargetItem || !matchResult) return;

  const matchedIds = matchResult.suggested_item_ids.map((id) => Number(id));
  const allIds = [matchTargetItem.id, ...matchedIds];

  setSelectedClosetIds(allIds);
  setShowMatchModal(false);
  setShowOutfitModal(true); // reuse your existing outfit modal
};
const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        window.location.href = "/login";
      } else {
        console.log("Logout failed");
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };
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
}

  return (
    <div className="min-h-screen bg-[#d0cac3] text-white font-sans">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b shadow-sm border-white/10">
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
          <Link to="/dashboard">
            <button
              className="px-4 py-2 rounded-full border border-white/20 bg-[#661218] hover:bg-[#550f14] transition-colors"
            >
              My Outfits
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
        <div className="md:hidden flex flex-col justify-end items-end px-6 gap-3 pt-2 pb-5 text-sm">
          
          <Link to="/dashboard" className=" ml-auto">
            <button className="bg-[#661218] text-white  ml:auto hover:bg-[#550f14] transition-colors text-sm font-medium px-5 py-2 rounded-full">
              My Outfits
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
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-[#661218] hover:bg-[#550f14] transition-colors shadow-lg text-sm font-medium flex items-center gap-2"
      >
        + Add Closet
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
      {matchLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50">
          <div className="bg-[#550f14] text-white px-6 py-4 rounded-xl shadow-xl border-2 border-[#661218] text-sm">
            Finding the best match... ✨
          </div>
        </div>
      )}

      {showMatchModal && matchResult && matchTargetItem && (
  <div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-white text-gray-900 p-6 rounded-2xl w-full max-w-md shadow-xl">
      <h2 className="text-lg font-semibold text-[#661218] mb-4">Suggested match</h2>

      <div className="w-24 aspect-square rounded-lg overflow-hidden mb-4 border-2 border-[#661218] mx-auto">
        <img
          src={matchTargetItem.image}
          alt={matchTargetItem.fileName}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-center text-xs text-gray-400 mb-3">pairs well with</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {closets
          .filter((item) => matchResult.suggested_item_ids.includes(String(item.id)))
          .map((item) => (
            <div key={item.id} className="aspect-square rounded-lg overflow-hidden">
              <img src={item.image} alt={item.fileName} className="w-full h-full object-cover" />
            </div>
          ))}
      </div>

      <p className="text-sm text-gray-600 mb-5">{matchResult.reasoning}</p>

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
          onClick={saveMatchAsOutfit}
          className="px-4 py-2 text-sm rounded-full bg-[#661218] text-white hover:bg-[#550f14]"
        >
          Save as Outfit
        </button>
      </div>
    </div>
  </div>
)}

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-[#661218]">My Closet</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    matchOutfit(item.id);
                  }}
                  className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 left-1 bg-[#661218] text-white w-6 h-6 rounded-full items-center justify-center text-xs"
                  aria-label="Match with closet"
                >
                  ✨
                </button>

                {/* Mobile: long-press delete overlay */}
                {/* Mobile: long-press delete/match overlay */}
                {longPressId === item.id && (
                  <div
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-6 rounded-lg sm:hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => matchOutfit(item.id)}
                      className="bg-[#661218] text-white text-xs px-4 py-2 rounded-md w-30"
                    >
                      ✨ Match
                    </button>
                    <button
                      onClick={() => deleteClothing(item.id)}
                      className="bg-red-500 text-white text-xs px-4 py-2 rounded-md w-30"
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