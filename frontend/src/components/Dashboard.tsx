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

  return (
    <div>
      <h1>My Outfits</h1>
      {outfits.map((outfit) => (
        <div key={outfit.id}>
          <h2>{outfit.name}</h2>

          <div className="grid grid-cols-3 gap-2">
            {outfit.closetItems.map((item) => (
              <img key={item.id} src={item.image} alt={item.fileName} />
            ))}
          </div>
        </div>
      ))}
      <div>
        <h2>Closet</h2>
        <div className="grid grid-cols-2 gap-2">
          {closets.map((item) => (
            <img key={item.id} src={item.image} alt={item.fileName} />
          ))}
        </div>
      </div>
    </div>
  );
}