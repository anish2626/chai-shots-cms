import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await apiFetch("/catalog/programs");
      setPrograms(res.data);   // ✅ FIX
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading programs...</p>;

  return (
    <div>
      <h1>Programs</h1>

      {programs.length === 0 && <p>No programs found</p>}

      <ul>
        {programs.map((p) => (
          <li key={p.id}>
            <Link to={`/programs/${p.id}`}>
              <strong>{p.title}</strong> — {p.description}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
