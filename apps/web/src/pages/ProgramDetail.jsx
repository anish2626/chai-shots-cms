import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";

export default function ProgramDetail() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(`/catalog/programs/${id}`);
        setProgram(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!program) return <p>Program not found</p>;

  return (
    <div>
      <h1>{program.title}</h1>
      <p>{program.description}</p>

      <p>
        <strong>Primary language:</strong> {program.languagePrimary}
      </p>

      <p>
        <strong>Available languages:</strong>{" "}
        {program.languagesAvailable.join(", ")}
      </p>

      {program.assets?.posters?.en && (
        <img
          src={program.assets.posters.en.portrait}
          alt={program.title}
          width="200"
        />
      )}
    </div>
  );
}
