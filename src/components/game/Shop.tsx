import React, { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  price: number;
  icon?: string;
}

export default function Shop() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 GitHub Raw JSON URL (اپنا URL یہاں لگائیں)
  const itemsUrl =
    "https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/data/items.json";

  useEffect(() => {
    fetch(itemsUrl)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading shop:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Loading Shop...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "white", fontSize: 30 }}>Shop</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#222",
              padding: 15,
              borderRadius: 10,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
            </div>

            <button
              style={{
                background: "lime",
                padding: "8px 15px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
