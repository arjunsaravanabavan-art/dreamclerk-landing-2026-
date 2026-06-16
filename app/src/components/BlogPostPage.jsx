import { useEffect, useMemo, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { getPostBySlug } from "../lib/supabase.js";
import { renderMarkdown } from "../lib/markdown.jsx";
import { useSEO, SEO } from "../lib/seo.js";

/**
 * Tiny safe markdown renderer — paragraphs, h2/h3, lists, blockquote, code, hr, links.
 * We deliberately do NOT use a full markdown lib to keep the bundle small and
 * keep the visual language consistent with the landing-page prose.
 */

/**
 * BlogPostPage — /blog/:slug
 * Fetches a single post by slug. Not-found state is rendered if slug doesn't exist.
 *
 * Layout: kicker + breadcrumb on top, title block (with optional left rule), then
 * a 2-column layout on >=1024px (sticky TOC | article body) and single column
 * below. Body is left-aligned at 720px max-width within a 1080px wrap.
 */
export default function BlogPostPage({ slug }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    document.title = post?.title ? `${post.title} — dreamclerk` : "loading — dreamclerk";
  }, [post]);
  useSEO(post ? SEO.blogPost(post) : { title: "loading", path: `/blog/${slug}` });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const data = await getPostBySlug(slug);
        if (cancelled) return;
        if (data) setPost(data);
        else setNotFound(true);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // Extract a TOC from the body (h2s only — light, not overwhelming).
  const toc = useMemo(() => {
    if (!post?.body) return [];
    const out = [];
    const lines = post.body.split(/\r?\n/);
    lines.forEach((ln) => {
      const m = /^##\s+(.+)$/.exec(ln);
      if (m) {
        const t = m[1].trim();
        const id = t.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
        out.push({ id, t });
      }
    });
    return out;
  }, [post]);

  if (loading) {
    return (
      <section className="section bp3" id="blog">
        <div className="wrap bp3__wrap">
          <SectionLabel status="ok">$ cat /blog/{slug}.md</SectionLabel>
          <p className="bp3__loading">$ loading post…</p>
        </div>
      </section>
    );
  }

  if (notFound || !post) {
    return (
      <section className="section bp3" id="blog">
        <div className="wrap bp3__wrap">
          <SectionLabel status="warn">$ cat /blog/{slug}.md</SectionLabel>
          <h1 className="bp3__404">404 · post not found.</h1>
          <p>no post by the slug <code>{slug}</code>. <a href="/blog">back to the blog index →</a></p>
          <p className="legal__back"><a href="/">← back to dreamclerk</a></p>
        </div>
      </section>
    );
  }

  return (
    <article className="section bp3" id="blog">
      <div className="wrap bp3__wrap">
        <SectionLabel status="ok">$ cat /blog/{slug}.md</SectionLabel>

        <nav className="bp3__crumb" aria-label="breadcrumbs">
          <a href="/">home</a>
          <span className="bp3__crumb-sep">/</span>
          <a href="/blog">blog</a>
          <span className="bp3__crumb-sep">/</span>
          <span aria-current="page">{slug}</span>
        </nav>

        <div className="bp3__layout">
          {toc.length > 2 ? (
            <aside className="bp3__toc" aria-label="on this page">
              <span className="bp3__toc-h">on this page</span>
              {toc.map((h) => (
                <a key={h.id} href={`#${h.id}`}>{h.t}</a>
              ))}
            </aside>
          ) : null}

          <div>
            <header className="bp3__head">
              <span className="bp3__kicker">dreamclerk blog</span>
              <h1 className="bp3__title">{post.title}</h1>
              <div className="bp3__meta">
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })}</span>
                {post.reading_time ? (<><span className="dot" /><span>{post.reading_time} min read</span></>) : null}
                {post.author_name ? (<><span className="dot" /><span>{post.author_name}</span></>) : null}
                {post.tags && post.tags.length > 0 ? (
                  <span className="bp3__tags">
                    {post.tags.map((t) => <span key={t} className="bp3__tag">{t}</span>)}
                  </span>
                ) : null}
              </div>
              {post.excerpt ? <p className="bp3__lede">{post.excerpt}</p> : null}
            </header>

            <div className="bp3__body">{renderMarkdown(post.body)}</div>

            <footer className="bp3__foot">
              <a href="/blog" className="bp3__back">← all posts</a>
              <p className="legal__back"><a href="/">← back to dreamclerk</a></p>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
