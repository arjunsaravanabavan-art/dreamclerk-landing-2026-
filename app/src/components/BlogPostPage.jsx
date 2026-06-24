import { useEffect, useMemo, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import NotifyCTA from "./NotifyCTA.jsx";
import { getPostBySlug } from "../lib/supabase.js";
import { renderMarkdown } from "../lib/markdown.jsx";
import { useSEO, SEO } from "../lib/seo.js";
import { RouterLink } from "../lib/router.jsx";

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
          <p>no post by the slug <code>{slug}</code>. <RouterLink to="/blog">back to the blog index →</RouterLink></p>
          <p className="legal__back"><RouterLink to="/">← back to dreamclerk</RouterLink></p>
        </div>
      </section>
    );
  }

  return (
    <article className="section bp3" id="blog">
      <div className="wrap bp3__wrap">
        <SectionLabel status="ok">$ cat /blog/{slug}.md</SectionLabel>

        <nav className="bp3__crumb" aria-label="breadcrumbs">
          <RouterLink to="/">home</RouterLink>
          <span className="bp3__crumb-sep">/</span>
          <RouterLink to="/blog">blog</RouterLink>
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
                {post.updated_at && post.updated_at !== (post.published_at || post.created_at) ? (
                  <><span className="dot" /><span title={`last updated ${new Date(post.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })}`} className="bp3__updated">updated</span></>
                ) : null}
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

            {post.faq && post.faq.length ? (
              <section className="bp3__faq" aria-labelledby="bp3-faq-h">
                <span className="bp3__kicker" id="bp3-faq-h">frequently asked, briefly</span>
                <ol className="bp3__faq-list">
                  {post.faq.map((f, i) => (
                    <li key={i} className="bp3__faq-item">
                      <details>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {post.outbound_links && post.outbound_links.length ? (
              <section className="bp3__sources" aria-labelledby="bp3-sources-h">
                <span className="bp3__kicker" id="bp3-sources-h">sources &amp; further reading</span>
                <ul className="bp3__sources-list">
                  {post.outbound_links.map((l, i) => (
                    <li key={i}>
                      <a href={l.href} rel="noopener noreferrer" target="_blank">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {post.author_person ? (
              <aside className="bp3__byline" aria-label="about the author">
                <div className="bp3__byline-name">
                  <strong>{post.author_person.name}</strong>
                  {post.author_person.role ? <span> · {post.author_person.role}</span> : null}
                </div>
                {post.author_person.bio ? <p className="bp3__byline-bio">{post.author_person.bio}</p> : null}
                {post.author_person.sameAs && post.author_person.sameAs.length ? (
                  <ul className="bp3__byline-sameas">
                    {post.author_person.sameAs.map((u, i) => (
                      <li key={i}><a href={u} rel="noopener noreferrer me" target="_blank">{u.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a></li>
                    ))}
                  </ul>
                ) : null}
              </aside>
            ) : null}

            <footer className="bp3__foot">
              <NotifyCTA source={`blog-post-${slug}`} cta="notify me" />
              <RouterLink to="/blog" className="bp3__back">← all posts</RouterLink>
              <p className="legal__back"><RouterLink to="/">← back to dreamclerk</RouterLink></p>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
