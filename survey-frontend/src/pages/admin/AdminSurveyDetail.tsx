import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { adminGetSurveyById } from "@/services/api";
import { Survey } from "@/types";
import { surveyQuestions } from "../../datas/Questions";
import { formatMs } from "@/utils/time";

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.25rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-weight: 800;
  color: var(--color-secondary);
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
`;

const Muted = styled.div`
  color: var(--color-primary);
  font-size: 0.95rem;
`;

const Tag = styled.span<{ kind?: "ok" | "warn" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  margin-left: 0.5rem;
  background: ${({ kind }) =>
    kind === "ok" ? "rgba(46, 204, 113, 0.15)" : "rgba(241, 196, 15, 0.15)"};
  color: ${({ kind }) => (kind === "ok" ? "#2ecc71" : "#f1c40f")};
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.75rem;

  > div {
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 0.75rem;
  }

  h4 {
    font-size: 0.85rem;
    color: var(--color-primary);
    margin-bottom: 0.35rem;
  }
  p {
    font-weight: 700;
    color: var(--color-third);
  }
`;

const QItem = styled.div`
  border-bottom: 1px solid #f0f0f0;
  padding: 1rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const QHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;

  h3 {
    font-weight: 700;
    color: var(--color-third);
    font-size: 1.05rem;
  }

  span {
    color: var(--color-primary);
    font-size: 0.9rem;
    white-space: nowrap;
  }
`;

const Answer = styled.div`
  background: rgba(126, 94, 242, 0.06);
  border-left: 3px solid var(--color-secondary);
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  color: var(--color-third);
  font-weight: 600;
  word-break: break-word;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #fff;
  background: var(--color-secondary);
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
  margin-bottom: 1rem;
  &:hover {
    background: #6a4fd0;
  }
`;

const AdminSurveyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        if (id) {
          const data = await adminGetSurveyById(id);
          setSurvey(data);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const timingMap = useMemo(() => {
    const map = new Map<number, number>();
    survey?.questionTimings?.forEach((t) => {
      map.set(t.questionId, t.duration);
    });
    return map;
  }, [survey]);

  if (loading) {
    return <Card>Yükleniyor...</Card>;
  }
  if (!survey) {
    return <Card>Kayıt bulunamadı.</Card>;
  }

  const completedAt = survey.endTime
    ? new Date(survey.endTime).toLocaleString()
    : "-";

  return (
    <Wrap>
      <Card>
        <Back to="/admin">← Dashboard</Back>
        <Title>
          {survey.name} {survey.surname}
          <Tag kind={survey.completed ? "ok" : "warn"}>
            {survey.completed ? "Tamamlandı" : "Devam Ediyor"}
          </Tag>
        </Title>
        <Muted>Survey ID: {survey._id}</Muted>

        <InfoRow>
          <div>
            <h4>Başlangıç</h4>
            <p>{new Date(survey.startTime).toLocaleString()}</p>
          </div>
          <div>
            <h4>Tamamlanma</h4>
            <p>{completedAt}</p>
          </div>
          <div>
            <h4>Toplam Süre</h4>
            <p>{survey.completed ? formatMs(survey.totalTime) : "-"}</p>
          </div>
          <div>
            <h4>Kayıt Oluşturma</h4>
            <p>
              {survey.createdAt
                ? new Date(survey.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </InfoRow>
      </Card>

      <Card>
        <Title>Cevaplar ve Süreler</Title>
        {surveyQuestions.map((q, idx) => {
          const answer = survey.answers?.[q.id] ?? "";
          const dur = timingMap.get(q.id);
          return (
            <QItem key={q.id}>
              <QHead>
                <h3>
                  {idx + 1}. {q.text}
                </h3>
                <span>Harcanan süre: {formatMs(dur)}</span>
              </QHead>
              <Answer>{answer || "Cevap yok"}</Answer>
            </QItem>
          );
        })}
      </Card>
    </Wrap>
  );
};

export default AdminSurveyDetail;
