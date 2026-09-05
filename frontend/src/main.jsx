import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await fetch("/api/items");
    setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setName("");
    load();
  };

  return (
    <div style={{maxWidth:700, margin:"40px auto", fontFamily:"Arial"}}>
      <h1>Production MERN Docker Demo - Auto Deploy Working</h1>
      <small>Hello bro i am auto deploy</small>
      <p>Nginx → React → Node.js → MongoDB → Volume</p>

      <form onSubmit={add} style={{display:"flex", gap:8}}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Add item"
          style={{flex:1, padding:12}}
        />
        <button>Add</button>
      </form>

      <ul>
        {items.map(item => <li key={item._id}>{item.name}</li>)}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
