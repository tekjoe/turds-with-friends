"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  userName: string;
  avatarUrl: string | null;
}

interface LocationCommentsProps {
  locationLogId: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function LocationComments({ locationLogId }: LocationCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/locations/${locationLogId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationLogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);

    const res = await fetch(`/api/locations/${locationLogId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });

    if (res.ok) {
      setBody("");
      fetchComments();
    }
    setSubmitting(false);
  };

  return (
    <div
      style={{ marginTop: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}
    >
      <p style={{ fontSize: "11px", fontWeight: 700, marginBottom: "6px", color: "#64748b" }}>
        Comments
      </p>

      {loading ? (
        <p style={{ fontSize: "11px", color: "#94a3b8" }}>Loading...</p>
      ) : (
        <>
          {comments.length === 0 && (
            <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>
              No comments yet
            </p>
          )}

          <div style={{ maxHeight: "120px", overflowY: "auto", marginBottom: "6px" }}>
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-start",
                  marginBottom: "6px",
                }}
              >
                {c.avatarUrl ? (
                  <img
                    src={c.avatarUrl}
                    alt=""
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#92400E20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#92400E",
                      flexShrink: 0,
                    }}
                  >
                    {c.userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "11px", margin: 0 }}>
                    <span style={{ fontWeight: 600 }}>{c.userName}</span>{" "}
                    <span style={{ color: "#94a3b8" }}>{timeAgo(c.created_at)}</span>
                  </p>
                  <p style={{ fontSize: "12px", margin: "1px 0 0", wordBreak: "break-word" }}>
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "4px" }}
          >
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                fontSize: "12px",
                padding: "4px 8px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                outline: "none",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 10px",
                backgroundColor: "#92400E",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting || !body.trim() ? 0.5 : 1,
              }}
            >
              Post
            </button>
          </form>
        </>
      )}
    </div>
  );
}
