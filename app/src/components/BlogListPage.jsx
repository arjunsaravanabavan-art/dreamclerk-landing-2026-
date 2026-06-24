import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { listPublishedPosts, isConfigured } from "../lib/supabase.js";
import { useSEO, SEO } from "../lib/seo.js";
import { SEED_POSTS } from "../lib/seedPosts.js";
import { RouterLink } from "../lib/router.jsx";

/**
 * BlogListPage — public blog index. /blog
 * Fetches published posts from supabase; falls back to SEED_POSTS
 * (always shows posts) even when Supabase is unreachable or empty.
 */
export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { document.title = "blog — dreamclerk"; }, []);
  // blogList now takes posts and emits an ItemList schema; fall back to
  // the static SEO.blog block if no posts have loaded yet so we never
  // inject an empty ItemList into the head.
  useSEO(posts.length ? SEO.blogList(posts) : SEO.blog);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listPublishedPosts();
        if (!cancelled) {
          // Always fall back to seed posts when Supabase returns nothing,
          // so the blog never appears empty to a visitor.
          setPosts((data && data.length > 0) ? data : SEED_POSTS);
        }
      } catch {
        if (!cancelled) setPosts(SEED_POSTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="section blog3" id="blog">
      <div className="wrap blog3__wrap">
        <SectionLabel status="ok">$ ls -la /blog/</SectionLabel>

        <header className="blog3__head">
          <span className="blog3__kicker">field notes</span>
          <h1 className="blog3__h1">blog.</h1>
          <p className="blog3__sub">field notes from building dreamclerk. the data, the rejects, the rubric changes. nothing polished after the fact.</p>
        </header>

        {loading ? (
          <p className="blog3__loading">$ loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="blog3__empty">
            no posts yet. sign in at <RouterLink to="/admin">/admin</RouterLink> to publish the first one.
          </p>
        ) : (
          <ol className="blog3__list">
            {posts.map((p) => (
              <li key={p.id} className="blog3__post">
                <a href={`/blog/${p.slug}`} className="blog3__post-link">
                  <div className="blog3__post-meta">
                    <span className="blog3__post-date">
                      {new Date(p.published_at || p.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" })}
                    </span>
                    {p.reading_time ? <span>· {p.reading_time} min read</span> : null}
                    {p.tags && p.tags.length > 0 ? (
                      <span className="blog3__post-tags">
                        {p.tags.map((t) => <span key={t} className="blog3__post-tag">{t}</span>)}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="blog3__post-title">{p.title}</h2>
                  {p.excerpt ? <p className="blog3__post-excerpt">{p.excerpt}</p> : null}
                  <span className="blog3__post-cta">read</span>
                </a>
              </li>
            ))}
          </ol>
        )}

        <p className="legal__back">
          <RouterLink to="/">← back to dreamclerk</RouterLink>
        </p>
      </div>
    </section>
  );
}
