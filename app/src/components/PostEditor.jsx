import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { getPostById, upsertPost, deletePost, ADMIN_EMAIL } from "../lib/supabase.js";
import { renderMarkdown, slugify } from "../lib/markdown.jsx";
import { RouterLink } from "../lib/router.jsx";

/**
 * PostEditor — markdown editor with live preview.
 * - Left: textarea (raw markdown)
 * - Right: rendered preview
 * - Top: title, slug, excerpt, tags, reading time, published toggle
 * - On save: upserts via supabase, then navigates back to the dashboard
 *
 * The editor handles three modes:
 *   - new: blank form
 *   - edit: form populated from getPostById(id)
 *   - delete: triggered from the dashboard, not from here
 */
export default function PostEditor({ postId, onClose, onSaved }) {
  const isNew = !postId;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    id: postId || null,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    tags: [],
    reading_time: 4,
    published: false,
    published_at: null,
    author_name: "",
  });
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    document.title = (isNew ? "new post" : "edit post") + " — admin — dreamclerk";
  }, [isNew]);

  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const found = await getPostById(postId);
        if (cancelled) return;
        if (found) {
          setForm({
            id: found.id,
            title: found.title || "",
            slug: found.slug || "",
            excerpt: found.excerpt || "",
            body: found.body || "",
            tags: found.tags || [],
            reading_time: found.reading_time || 1,
            published: !!found.published,
            published_at: found.published_at || null,
            author_name: found.author_name || "",
          });
          setTagsInput((found.tags || []).join(", "));
        } else {
          setErr("post not found (it may have been deleted).");
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "failed to load post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [postId, isNew]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function onTitleChange(v) {
    set("title", v);
    if (isNew || !form.slug) set("slug", slugify(v));
  }
  function onTagsBlur() {
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    set("tags", tags);
  }
  function onBodyChange(v) {
    set("body", v);
    // naive reading time: 220 wpm
    const words = (v.match(/\S+/g) || []).length;
    set("reading_time", Math.max(1, Math.round(words / 220)));
  }
  function onPublishedChange(v) {
    // Toggling published updates both `published` and `published_at` in form state
    // so the visual state and the persisted state stay in sync.
    set("published", v);
    set("published_at", v ? (form.published_at || new Date().toISOString()) : null);
  }

  async function onSave() {
    setErr("");
    if (!form.title?.trim()) { setErr("title is required."); return; }
    if (!form.slug?.trim())   { setErr("slug is required.");  return; }
    if (!form.body?.trim())   { setErr("body is required.");  return; }
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        ...form,
        tags,
        author_name: form.author_name?.trim() || ADMIN_EMAIL || "dreamclerk team",
        published_at: form.published ? (form.published_at || new Date().toISOString()) : null,
      };
      const r = await upsertPost(payload);
      if (!r?.ok) { setErr(r?.error || "save failed"); return; }
      onSaved && onSaved(r);
    } catch (e) {
      setErr(e?.message || "save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    if (!window.confirm(`delete "${form.title || "untitled"}"? this cannot be undone.`)) return;
    setSaving(true);
    try {
      const r = await deletePost(form.id);
      if (!r?.ok) { setErr(r?.error || "delete failed"); setSaving(false); return; }
      onSaved && onSaved({ deleted: true });
    } catch (e) {
      setErr(e?.message || "delete failed");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="section adm0" id="admin">
        <div className="wrap adm0__wrap">
          <SectionLabel status="ok">$ /admin/edit</SectionLabel>
          <p className="adm0__loading">$ loading post…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section adm0" id="admin">
      <div className="wrap adm0__wrap">
        <SectionLabel status="ok">$ /admin/edit · {isNew ? "new" : "editing"}</SectionLabel>

        <header className="adm0__head">
          <h1 className="adm0__h1">{isNew ? "new post." : "edit post."}</h1>
          <div className="adm0__head-actions">
            {!isNew && (
              <button className="btn adm0__del" onClick={onDelete} disabled={saving}>delete</button>
            )}
            <button className="btn" onClick={onClose}>cancel</button>
            <button className="btn btn--solid" onClick={onSave} disabled={saving}>
              {saving ? "saving…" : (form.published ? "save + publish" : "save draft")}
            </button>
          </div>
        </header>

        <div className="adm0__form adm0__form--wide">
          <label className="adm0__label">
            <span className="adm0__label-h">$ title</span>
            <input className="adm0__input" value={form.title || ""} onChange={(e) => onTitleChange(e.target.value)} placeholder="why we built dreamclerk" />
          </label>
          <div className="adm0__row">
            <label className="adm0__label adm0__label--grow">
              <span className="adm0__label-h">$ slug</span>
              <input className="adm0__input" value={form.slug || ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="why-we-built-dreamclerk" />
            </label>
            <label className="adm0__label adm0__label--small">
              <span className="adm0__label-h">$ read (min)</span>
              <input className="adm0__input" type="number" min="1" value={form.reading_time || 1} onChange={(e) => set("reading_time", Number(e.target.value) || 1)} />
            </label>
            <label className="adm0__label adm0__label--small">
              <span className="adm0__label-h">$ status</span>
              <label className="adm0__toggle">
                <input type="checkbox" checked={!!form.published} onChange={(e) => onPublishedChange(e.target.checked)} />
                <span>{form.published ? "● published" : "○ draft"}</span>
              </label>
            </label>
          </div>
          <label className="adm0__label">
            <span className="adm0__label-h">$ excerpt</span>
            <input className="adm0__input" value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} placeholder="1 short sentence, under 220 chars." />
          </label>
          <label className="adm0__label">
            <span className="adm0__label-h">$ tags (comma-separated)</span>
            <input className="adm0__input" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} onBlur={onTagsBlur} placeholder="meta, hiring, design" />
          </label>
          <label className="adm0__label">
            <span className="adm0__label-h">$ author</span>
            <input className="adm0__input" value={form.author_name || ""} onChange={(e) => set("author_name", e.target.value)} placeholder="dreamclerk team" />
          </label>

          <div className="adm0__edit-grid">
            <label className="adm0__label">
              <span className="adm0__label-h">$ body (markdown)</span>
              <textarea className="adm0__textarea" value={form.body || ""} onChange={(e) => onBodyChange(e.target.value)} placeholder={"# heading\n\nwrite the post in markdown.\n\n## subhead\n\nparagraphs, **bold**, *italic*, `code`, lists, > quotes.\n\n```js\nconst x = 42;\n```"} />
            </label>
            <div className="adm0__preview">
              <div className="adm0__preview-h">$ preview</div>
              <div className="adm0__preview-body">
                <h1 className="adm0__prev-title">{form.title || "untitled"}</h1>
                {form.excerpt ? <p className="bp3__lede">{form.excerpt}</p> : null}
                {renderMarkdown(form.body) || <p className="adm0__prev-empty">$ empty body — start typing on the left</p>}
              </div>
            </div>
          </div>

          {err ? <p className="adm0__err">! {err}</p> : null}

          <div className="adm0__form-actions">
            <button className="btn" onClick={onClose}>cancel</button>
            <button className="btn btn--solid" onClick={onSave} disabled={saving}>
              {saving ? "saving…" : (form.published ? "save + publish" : "save draft")}
            </button>
          </div>
        </div>

        <p className="legal__back"><RouterLink to="/admin">← back to dashboard</RouterLink></p>
      </div>
    </section>
  );
}
