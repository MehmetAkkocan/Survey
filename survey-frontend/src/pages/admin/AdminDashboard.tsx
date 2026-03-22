import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { adminGetAllSurveys } from "@/services/api";
import { Survey } from "@/types";
import { formatMs } from "../../utils/time";

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-weight: 800;
  color: var(--color-secondary);
  font-size: 1.4rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;

  input,
  select {
    padding: 0.6rem 0.75rem;
    border: 2px solid #eaeaea;
    border-radius: 8px;
    min-width: 200px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus,
  select:focus {
    border-color: var(--color-secondary);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  th,
  td {
    text-align: left;
    padding: 0.85rem 0.75rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95rem;
    color: var(--color-third);
  }

  th {
    font-weight: 700;
    color: var(--color-primary);
    background: #fafafa;
  }

  tr:hover td {
    background: #faf9ff;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 700;
  }
  .chip.ok {
    background: rgba(46, 204, 113, 0.15);
    color: #2ecc71;
  }
  .chip.pending {
    background: rgba(241, 196, 15, 0.15);
    color: #f1c40f;
  }

  .action {
    color: #fff;
    background: var(--color-secondary);
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s;
  }
  .action:hover {
    background: #6a4fd0;
  }
`;

const Empty = styled.div`
  text-align: center;
  color: var(--color-primary);
  padding: 2rem 1rem;
`;

const AdminDashboard: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [onlyCompleted, setOnlyCompleted] = useState<
    "all" | "completed" | "incomplete"
  >("all");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await adminGetAllSurveys();
        const sorted = [...data].sort((a, b) => {
          const ad = a.createdAt
            ? new Date(a.createdAt).getTime()
            : new Date(a.startTime).getTime();
          const bd = b.createdAt
            ? new Date(b.createdAt).getTime()
            : new Date(b.startTime).getTime();
          return bd - ad;
        });
        setSurveys(sorted);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return surveys.filter((s) => {
      const matchesText =
        !term || `${s.name} ${s.surname}`.toLowerCase().includes(term);
      const matchesCompletion =
        onlyCompleted === "all" ||
        (onlyCompleted === "completed" && s.completed) ||
        (onlyCompleted === "incomplete" && !s.completed);
      return matchesText && matchesCompletion;
    });
  }, [surveys, q, onlyCompleted]);

  return (
    <Card>
      <TitleRow>
        <Title>Admin Dashboard — Anketler</Title>
        <Controls>
          <input
            placeholder="İsim / Soyisim ara..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            value={onlyCompleted}
            onChange={(e) => setOnlyCompleted(e.target.value as any)}
          >
            <option value="all">Tümü</option>
            <option value="completed">Tamamlananlar</option>
            <option value="incomplete">Tamamlanmayanlar</option>
          </select>
        </Controls>
      </TitleRow>

      {loading ? (
        <Empty>Yükleniyor...</Empty>
      ) : filtered.length === 0 ? (
        <Empty>Kayıt bulunamadı.</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Başlangıç</th>
              <th>Durum</th>
              <th>Toplam Süre</th>
              <th>Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id}>
                <td>
                  <strong>
                    {s.name} {s.surname}
                  </strong>
                </td>
                <td>{new Date(s.startTime).toLocaleString()}</td>
                <td>
                  <span className={`chip ${s.completed ? "ok" : "pending"}`}>
                    {s.completed ? "Tamamlandı" : "Devam Ediyor"}
                  </span>
                </td>
                <td>{s.completed ? formatMs(s.totalTime) : "-"}</td>
                <td>
                  {s._id && (
                    <Link className="action" to={`/admin/surveys/${s._id}`}>
                      Görüntüle
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default AdminDashboard;
