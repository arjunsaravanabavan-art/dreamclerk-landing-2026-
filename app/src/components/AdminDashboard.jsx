import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { listAllPostsAdmin, deletePost } from "../lib/supabase.js";
import PostEditor from "./PostEditor.jsx";

/**
 * AdminDashboard — list of all posts (drafts + published) with edit/delete.
 * Inline editor; toggle by setting `editing` to a post id or "new".
 *
 * Delete uses an inline two-step confirm (click delete → click confirm
 * within 4s) so we never throw a native confirm() dialog.
 */
export default function AdminDashboard({ session, onSignOut }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | "new" | postId
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [err, setErr] = useState("");

  async function reload() {
    setLoading(true);
    try {
      const data = await listAllPostsAdmin();
      setPosts(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  // Auto-cancel inline confirm after 4s of inactivity.
  useEffect(() => {
    if (!confirmingId) return;
    const t = setTimeout(() => setConfirmingId(null), 4000);
    return () => clearTimeout(t);
  }, [confirmingId]);

  async function onDelete(id) {
    setErr("");
    setBusyId(id);
    const r = await deletePost(id);
    setBusyId(null);
    setConfirmingId(null);
    if (!r?.ok) { setErr(r?.error || "delete failed"); return; }
    await reload();
  }

  if (editing) {
    return (
      <PostEditor
        postId={editing === "new" ? null : editing}
        onClose={() => { setEditing(null); reload(); }}
        onSaved={() => { setEditing(null); reload(); }}
      />
    );
  }

  return (
    <section className="section adm0" id="admin">
      <div className="wrap adm0__wrap">
        <SectionLabel status="ok">$ /admin · dashboard</SectionLabel>

        {err ? <p className="adm0__err">! {err}</p> : null}

        <header className="adm0__head">
          <div>
            <h1 className="adm0__h1">posts.</h1>
            <p className="adm0__sub">{session?.user?.email} · {posts.length} {posts.length === 1 ? "post" : "posts"}</p>
          </div>
          <div className="adm0__head-actions">
            <a className="btn" href="/blog" target="_blank" rel="noreferrer">view public blog ↗</a>
            <button className="btn btn--solid" onClick={() => setEditing("new")}>+ new post</button>
            <button className="btn" onClick={onSignOut}>sign out</button>
          </div>
        </header>

        {loading ? (
          <p className="adm0__loading">$ loading posts…</p>
        ) : posts.length === 0 ? (
          <div className="adm0__empty">
            <p>no posts yet. click <b>+ new post</b> above to write the first one.</p>
            <p className="adm0__empty-h">$ suggested seed</p>
            <p>title: <code>why we built dreamclerk: the 90-second internship interview that changed 14% of outcomes</code></p>
            <p>slug: <code>why-we-built-dreamclerk</code></p>
            <p>excerpt: 1 sentence, &lt; 220 chars. body: 600-800 words in the landing-page voice (short declarative, no buzzwords).</p>
          </div>
        ) : (
          <table className="adm0__table">
            <thead>
              <tr>
                <th>title</th>
                <th>slug</th>
                <th>status</th>
                <th>updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="adm0__title-cell">{p.title}</td>
                  <td><code>{p.slug}</code></td>
                  <td>
                    <span className={`adm0__pill ${p.published ? "is-pub" : "is-draft"}`}>
                      {p.published ? "● published" : "○ draft"}
                    </span>
                  </td>
                  <td className="adm0__date">{new Date(p.updated_at || p.created_at).toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" })}</td>
                  <td className="adm0__row-actions">
                    {confirmingId === p.id ? (
                      <>
                        <button
                          className="btn adm0__del adm0__del-confirm"
                          disabled={busyId === p.id}
                          onClick={() => onDelete(p.id)}
                        >
                          {busyId === p.id ? "deleting…" : "confirm delete"}
                        </button>
                        <button className="btn" onClick={() => setConfirmingId(null)}>cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={() => setEditing(p.id)}>edit</button>
                        <button className="btn adm0__del" onClick={() => setConfirmingId(p.id)}>delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="legal__back"><a href="/">← back to dreamclerk</a></p>
      </div>
    </section>
  );
}
