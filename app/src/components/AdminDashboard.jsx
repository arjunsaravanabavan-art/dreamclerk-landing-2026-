import { useEffect, useState, Fragment } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { listAllPostsAdmin, deletePost, listAllFeedbackAdmin, deleteFeedback, listAllSubscribersAdmin, deleteSubscriber, listAllNotifySignupsAdmin, deleteNotifySignup } from "../lib/supabase.js";
import PostEditor from "./PostEditor.jsx";
import { RouterLink } from "../lib/router.jsx";

// Single constant for the admin badge shown in the tab headers.
// The signed-in user's actual email is never rendered in the DOM —
// this protects against screen-share leaks and screenshot exposure.
const ADMIN_BADGE = "admin";

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

  // Tab state — "posts" is the original dashboard, "feedback" is the new
  // inbox of public submissions from /feedback. Same shell, different rows.
  const [tab, setTab] = useState("posts");

  // Feedback state. Independent from posts so switching tabs doesn't lose
  // the in-flight confirm.
  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackErr, setFeedbackErr] = useState("");
  const [feedbackConfirmingId, setFeedbackConfirmingId] = useState(null);
  const [feedbackBusyId, setFeedbackBusyId] = useState(null);

  // Waitlist (subscribers) state. Same pattern as feedback.
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersErr, setSubscribersErr] = useState("");
  const [subscribersConfirmingId, setSubscribersConfirmingId] = useState(null);
  const [subscribersBusyId, setSubscribersBusyId] = useState(null);

  // notify-me (notify_signups) state. Same pattern as feedback + subscribers.
  const [notify, setNotify] = useState([]);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyErr, setNotifyErr] = useState("");
  const [notifyConfirmingId, setNotifyConfirmingId] = useState(null);
  const [notifyBusyId, setNotifyBusyId] = useState(null);

  async function reload() {
    setLoading(true);
    try {
      const data = await listAllPostsAdmin();
      setPosts(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function reloadFeedback() {
    setFeedbackLoading(true);
    setFeedbackErr("");
    try {
      const data = await listAllFeedbackAdmin();
      setFeedback(data || []);
    } catch (e) {
      setFeedbackErr(e?.message || "could not load feedback");
    } finally {
      setFeedbackLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);
  useEffect(() => {
    if (tab === "feedback" && feedback.length === 0 && !feedbackLoading) {
      reloadFeedback();
    }
    if (tab === "waitlist" && subscribers.length === 0 && !subscribersLoading) {
      reloadSubscribers();
    }
    if (tab === "notify" && notify.length === 0 && !notifyLoading) {
      reloadNotify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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

  // Auto-cancel inline feedback confirm after 4s of inactivity.
  useEffect(() => {
    if (!feedbackConfirmingId) return;
    const t = setTimeout(() => setFeedbackConfirmingId(null), 4000);
    return () => clearTimeout(t);
  }, [feedbackConfirmingId]);

  async function onDeleteFeedback(id) {
    setFeedbackErr("");
    setFeedbackBusyId(id);
    const r = await deleteFeedback(id);
    setFeedbackBusyId(null);
    setFeedbackConfirmingId(null);
    if (!r?.ok) { setFeedbackErr(r?.error || "delete failed"); return; }
    // Optimistic remove from local list (no need to round-trip the table).
    setFeedback((rows) => rows.filter((row) => row.id !== id));
  }

  // ─── subscribers (waitlist) ──────────────────────────────────────────────
  async function reloadSubscribers() {
    setSubscribersLoading(true);
    setSubscribersErr("");
    try {
      const data = await listAllSubscribersAdmin();
      setSubscribers(data || []);
    } catch (e) {
      setSubscribersErr(e?.message || "could not load waitlist");
    } finally {
      setSubscribersLoading(false);
    }
  }

  // Auto-cancel inline subscribers confirm after 4s of inactivity.
  useEffect(() => {
    if (!subscribersConfirmingId) return;
    const t = setTimeout(() => setSubscribersConfirmingId(null), 4000);
    return () => clearTimeout(t);
  }, [subscribersConfirmingId]);

  async function onDeleteSubscriber(id) {
    setSubscribersErr("");
    setSubscribersBusyId(id);
    const r = await deleteSubscriber(id);
    setSubscribersBusyId(null);
    setSubscribersConfirmingId(null);
    if (!r?.ok) { setSubscribersErr(r?.error || "delete failed"); return; }
    // Optimistic remove from local list.
    setSubscribers((rows) => rows.filter((row) => row.id !== id));
  }

  // ─── notify_signups ("notify me" CTAs) ─────────────────────────────────
  async function reloadNotify() {
    setNotifyLoading(true);
    setNotifyErr("");
    try {
      const data = await listAllNotifySignupsAdmin();
      setNotify(data || []);
    } catch (e) {
      setNotifyErr(e?.message || "could not load notify signups");
    } finally {
      setNotifyLoading(false);
    }
  }

  // Auto-cancel inline notify confirm after 4s of inactivity.
  useEffect(() => {
    if (!notifyConfirmingId) return;
    const t = setTimeout(() => setNotifyConfirmingId(null), 4000);
    return () => clearTimeout(t);
  }, [notifyConfirmingId]);

  async function onDeleteNotify(id) {
    setNotifyErr("");
    setNotifyBusyId(id);
    const r = await deleteNotifySignup(id);
    setNotifyBusyId(null);
    setNotifyConfirmingId(null);
    if (!r?.ok) { setNotifyErr(r?.error || "delete failed"); return; }
    // Optimistic remove from local list.
    setNotify((rows) => rows.filter((row) => row.id !== id));
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

        <nav className="adm0__tabs" role="tablist" aria-label="admin sections">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "posts"}
            className={`adm0__tab ${tab === "posts" ? "is-active" : ""}`}
            onClick={() => setTab("posts")}
          >
            <span className="adm0__tab-idx">[P1]</span> posts
            <span className="adm0__tab-count">{posts.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "feedback"}
            className={`adm0__tab ${tab === "feedback" ? "is-active" : ""}`}
            onClick={() => setTab("feedback")}
          >
            <span className="adm0__tab-idx">[F1]</span> feedback
            {feedback.length > 0 ? <span className="adm0__tab-count">{feedback.length}</span> : null}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "waitlist"}
            className={`adm0__tab ${tab === "waitlist" ? "is-active" : ""}`}
            onClick={() => setTab("waitlist")}
          >
            <span className="adm0__tab-idx">[W1]</span> waitlist
            {subscribers.length > 0 ? <span className="adm0__tab-count">{subscribers.length}</span> : null}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "notify"}
            className={`adm0__tab ${tab === "notify" ? "is-active" : ""}`}
            onClick={() => setTab("notify")}
          >
            <span className="adm0__tab-idx">[N1]</span> notify-me
            {notify.length > 0 ? <span className="adm0__tab-count">{notify.length}</span> : null}
          </button>
        </nav>

        {tab === "posts" && (
          <Fragment>
            <header className="adm0__head">
              <div>
                <h1 className="adm0__h1">posts.</h1>
                <p className="adm0__sub">{ADMIN_BADGE} · {posts.length} {posts.length === 1 ? "post" : "posts"}</p>
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
          </Fragment>
        )}

        {tab === "feedback" && (
          <Fragment>
            <header className="adm0__head">
              <div>
                <h1 className="adm0__h1">feedback.</h1>
                <p className="adm0__sub">{ADMIN_BADGE} · {feedback.length} {feedback.length === 1 ? "submission" : "submissions"}</p>
              </div>
              <div className="adm0__head-actions">
                <button className="btn" onClick={reloadFeedback} disabled={feedbackLoading}>
                  {feedbackLoading ? "refreshing…" : "↻ refresh"}
                </button>
                <a className="btn" href="/feedback" target="_blank" rel="noreferrer">view public form ↗</a>
                <button className="btn" onClick={onSignOut}>sign out</button>
              </div>
            </header>

            {feedbackErr ? <p className="adm0__err">! {feedbackErr}</p> : null}

            {feedbackLoading && feedback.length === 0 ? (
              <p className="adm0__loading">$ loading feedback…</p>
            ) : feedback.length === 0 ? (
              <div className="adm0__empty">
                <p>no feedback yet. the public form at <a href="/feedback" target="_blank" rel="noreferrer">/feedback</a> is wired — submissions land here.</p>
                <p className="adm0__empty-h">$ what lands here</p>
                <p>anonymous messages from the /feedback form, with optional email + category. rate-limited server-side, 4 KB ceiling per message.</p>
              </div>
            ) : (
              <table className="adm0__table adm0__table--feedback">
                <thead>
                  <tr>
                    <th>when</th>
                    <th>cat</th>
                    <th>from</th>
                    <th>message</th>
                    <th>src</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((f) => (
                    <tr key={f.id}>
                      <td className="adm0__date">{new Date(f.created_at).toLocaleString("en-IN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                      <td>
                        <span className={`adm0__pill adm0__pill--cat adm0__pill--cat-${f.category || "other"}`}>
                          {f.category || "other"}
                        </span>
                      </td>
                      <td className="adm0__date">{f.email || <span className="adm0__anon">anonymous</span>}</td>
                      <td className="adm0__msg-cell">{f.message}</td>
                      <td><code className="adm0__src">{f.source || "feedback-page"}</code></td>
                      <td className="adm0__row-actions">
                        {feedbackConfirmingId === f.id ? (
                          <>
                            <button
                              className="btn adm0__del adm0__del-confirm"
                              disabled={feedbackBusyId === f.id}
                              onClick={() => onDeleteFeedback(f.id)}
                            >
                              {feedbackBusyId === f.id ? "deleting…" : "confirm delete"}
                            </button>
                            <button className="btn" onClick={() => setFeedbackConfirmingId(null)}>cancel</button>
                          </>
                        ) : (
                          <button className="btn adm0__del" onClick={() => setFeedbackConfirmingId(f.id)}>delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Fragment>
        )}

        {tab === "waitlist" && (
          <Fragment>
            <header className="adm0__head">
              <div>
                <h1 className="adm0__h1">waitlist.</h1>
                <p className="adm0__sub">{ADMIN_BADGE} · {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}</p>
              </div>
              <div className="adm0__head-actions">
                <button className="btn" onClick={reloadSubscribers} disabled={subscribersLoading}>
                  {subscribersLoading ? "refreshing…" : "↻ refresh"}
                </button>
                <a className="btn" href="/" target="_blank" rel="noreferrer">view public form ↗</a>
                <button className="btn" onClick={onSignOut}>sign out</button>
              </div>
            </header>

            {subscribersErr ? <p className="adm0__err">! {subscribersErr}</p> : null}

            {subscribersLoading && subscribers.length === 0 ? (
              <p className="adm0__loading">$ loading waitlist…</p>
            ) : subscribers.length === 0 ? (
              <div className="adm0__empty">
                <p>no subscribers yet. the waitlist form on the landing page is wired — emails land here.</p>
                <p className="adm0__empty-h">$ what lands here</p>
                <p>every email captured by the homepage waitlist counter, with timestamp. RLS gates this view to the admin email only.</p>
              </div>
            ) : (
              <table className="adm0__table adm0__table--waitlist">
                <thead>
                  <tr>
                    <th>when</th>
                    <th>email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id}>
                      <td className="adm0__date">{new Date(s.created_at).toLocaleString("en-IN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                      <td><a href={`mailto:${s.email}`} className="adm0__email">{s.email}</a></td>
                      <td className="adm0__row-actions">
                        {subscribersConfirmingId === s.id ? (
                          <>
                            <button
                              className="btn adm0__del adm0__del-confirm"
                              disabled={subscribersBusyId === s.id}
                              onClick={() => onDeleteSubscriber(s.id)}
                            >
                              {subscribersBusyId === s.id ? "deleting…" : "confirm delete"}
                            </button>
                            <button className="btn" onClick={() => setSubscribersConfirmingId(null)}>cancel</button>
                          </>
                        ) : (
                          <button className="btn adm0__del" onClick={() => setSubscribersConfirmingId(s.id)}>delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Fragment>
        )}

        {tab === "notify" && (
          <Fragment>
            <header className="adm0__head">
              <div>
                <h1 className="adm0__h1">notify-me.</h1>
                <p className="adm0__sub">{ADMIN_BADGE} · {notify.length} {notify.length === 1 ? "signup" : "signups"}</p>
              </div>
              <div className="adm0__head-actions">
                <button className="btn" onClick={reloadNotify} disabled={notifyLoading}>
                  {notifyLoading ? "refreshing…" : "↻ refresh"}
                </button>
                <a className="btn" href="/" target="_blank" rel="noreferrer">view public CTAs ↗</a>
                <button className="btn" onClick={onSignOut}>sign out</button>
              </div>
            </header>

            {notifyErr ? <p className="adm0__err">! {notifyErr}</p> : null}

            {notifyLoading && notify.length === 0 ? (
              <p className="adm0__loading">$ loading notify-me signups…</p>
            ) : notify.length === 0 ? (
              <div className="adm0__empty">
                <p>no "notify me" signups yet. the CTAs across the landing site are wired — emails land here.</p>
                <p className="adm0__empty-h">$ what lands here</p>
                <p>every "notify me" click on hero, tracks, final CTA, and /about. shows the source CTA so you can see which page actually converts.</p>
              </div>
            ) : (
              <table className="adm0__table adm0__table--notify">
                <thead>
                  <tr>
                    <th>when</th>
                    <th>email</th>
                    <th>name</th>
                    <th>source</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {notify.map((row) => (
                    <tr key={row.id}>
                      <td className="adm0__date">{new Date(row.created_at).toLocaleString("en-IN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                      <td><a href={`mailto:${row.email}`} className="adm0__email">{row.email}</a></td>
                      <td className="adm0__name">{row.name || <span className="adm0__anon">—</span>}</td>
                      <td><span className="adm0__src-pill">{row.source || "modal"}</span></td>
                      <td className="adm0__row-actions">
                        {notifyConfirmingId === row.id ? (
                          <>
                            <button
                              className="btn adm0__del adm0__del-confirm"
                              disabled={notifyBusyId === row.id}
                              onClick={() => onDeleteNotify(row.id)}
                            >
                              {notifyBusyId === row.id ? "deleting…" : "confirm delete"}
                            </button>
                            <button className="btn" onClick={() => setNotifyConfirmingId(null)}>cancel</button>
                          </>
                        ) : (
                          <button className="btn adm0__del" onClick={() => setNotifyConfirmingId(row.id)}>delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Fragment>
        )}

        <p className="legal__back"><RouterLink to="/">← back to dreamclerk</RouterLink></p>
      </div>
    </section>
  );
}
