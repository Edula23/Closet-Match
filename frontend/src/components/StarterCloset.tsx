// components/StarterCloset.tsx
import { useState } from "react";

interface StarterClothingItem {
  id: string;
  label: string;
  category: string;
  imageUrl: string;
}

// Swap these URLs for whatever you like — any public https image works.
// Unsplash/Pexels direct links are safe to hotlink (no CORS issues, free license).
const STARTER_ITEMS: StarterClothingItem[] = [
  {
    id: "starter-dress",
    label: "Summer dress",
    category: "dress",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
  },
  {
    id: "starter-tshirt",
    label: "White tee",
    category: "t-shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
  },
];

interface Props {
  onSaved: () => void; // trigger fetchCloset() in the parent after a save
}

export default function StarterCloset({ onSaved }: Props) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const dismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
  };

  const save = async (item: StarterClothingItem) => {
    setSaving(item.id);
    try {
      const res = await fetch("/api/closet/starter", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: item.label,
          imageUrl: item.imageUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Couldn't save this item");
        return;
      }
      dismiss(item.id);
      onSaved();
    } catch (err) {
      console.error("Error saving starter closet item:", err);
    } finally {
      setSaving(null);
    }
  };

  const visible = STARTER_ITEMS.filter((i) => !dismissed.includes(i.id));
  if (visible.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-sm mb-4 text-[#661218]">
        Try one of these to get started
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((item) => (
          <div
            key={item.id}
            className="relative hover:shadow-md rounded-2xl p-4 flex flex-col items-center text-center border border-[#aea8a1]"
          >
            <button
              onClick={() => dismiss(item.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full text-[#661218] text-sm flex items-center justify-center hover:bg-gray-100"
              aria-label="Dismiss"
            >
              ✕
            </button>

            <p className="text-sm font-medium mr-auto text-[#661218] mb-4">
              {item.label}
            </p>

            <div className="w-28 sm:w-32 shrink-0 bg-transparent p-1.5 pb-3 rounded-sm border-[#661218] border shadow-lg mb-4">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button
              onClick={() => save(item)}
              disabled={saving === item.id}
              className="px-4 border-[#661218] border-2 text-[#661218] text-sm py-1.5 ml-auto rounded-full hover:bg-[#550f14] hover:text-white disabled:opacity-50"
            >
              {saving === item.id ? "Saving..." : "Save"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}