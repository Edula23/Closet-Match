// components/StarterOutfits.tsx
import { useState } from "react";

interface StarterOutfit {
  id: string;
  label: string;
  items: { name: string; imageUrl: string }[];
}

// Swap these URLs for whatever you like — any public https image works.
// Unsplash/Pexels direct links are safe to hotlink (no CORS issues, free license).
const STARTER_OUTFITS: StarterOutfit[] = [
  {
    id: "starter-women",
    label: "Everyday look",
    items: [
      { name: "Summer dress", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
      { name: "White sneakers", imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" },
    ],
  },
  {
    id: "starter-men",
    label: "Casual look",
    items: [
      { name: "White T-shirt", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
      { name: "Blue jeans", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    ],
  },
];

interface Props {
  onSaved: () => void; // trigger fetchCloset()/fetchOutfits() in Dashboard after a save
}

export default function StarterOutfits({ onSaved }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const dismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
    };

  const scatterSeed = (input: string | number) => {
  const str = String(input);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return hash;
};

  const save = async (outfit: StarterOutfit) => {
    setSaving(outfit.id);
    try {
      const res = await fetch("/api/outfits/starter", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: outfit.label,
          items: outfit.items,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Couldn't save this outfit");
        return;
      }
      dismiss(outfit.id);
      onSaved();
    } catch (err) {
      console.error("Error saving starter outfit:", err);
    } finally {
      setSaving(null);
    }
  };

  const visible = STARTER_OUTFITS.filter((o) => !dismissed.includes(o.id));
  if (visible.length === 0) return null;

  return (
    <section className="mb-12">
  <h2 className="text-sm mb-4 text-[#661218]">
    Try one of these to get started
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {visible.map((outfit) => (
      <div
        key={outfit.id}
        className="relative hover:shadow-md rounded-2xl p-4 flex flex-col items-center text-center border border-[#aea8a1]"
      >
        <button
          onClick={() => dismiss(outfit.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full  text-[#661218] text-sm flex items-center justify-center hover:bg-gray-100"
          aria-label="Dismiss"
        >
          ✕
        </button>

        <p className="text-sm font-medium mr-auto text-[#661218] mb-4">
          {outfit.label}
        </p>

        <div className="flex items-end justify-center pt-4 pb-2 mb-4">
          {outfit.items.map((item, i) => {
            const seed = scatterSeed(item.name) + i * 7;
            const rotate = (seed % 21) - 10;
            const lift = (seed % 17) - 8;
            return (
              <div
                key={item.name}
                style={{
                  transform: `rotate(${rotate}deg) translateY(${lift}px)`,
                  zIndex: i,
                  marginLeft: i === 0 ? 0 : "-2.5rem",
                }}
                className="relative w-24 sm:w-28 shrink-0 bg-transparent p-1.5 pb-3 rounded-sm border-[#661218] border shadow-lg transition-transform duration-200 hover:-translate-y-2 hover:rotate-0 hover:z-40"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => save(outfit)}
          disabled={saving === outfit.id}
          className="px-4 border-[#661218] border-2 text-[#661218] text-sm py-1.5 ml-auto rounded-full hover:bg-[#550f14] hover:text-white disabled:opacity-50"
        >
          {saving === outfit.id ? "Saving..." : "Save"}
        </button>
      </div>
    ))}
  </div>
</section>
  );
}