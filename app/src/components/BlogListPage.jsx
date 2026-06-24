import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { listPublishedPosts, isConfigured } from "../lib/supabase.js";
import { useSEO, SEO } from "../lib/seo.js";
import { SEED_POSTS } from "../lib/seedPosts.js";
import { RouterLink } from "../lib/router.jsx";

/**
 * BlogListPage — public blog index. /blog
 *
 * Post source priority:
 *   1. SEED_POSTS is the source of truth for what *should* be on the blog.
 *      It is the snapshot baked into the JS bundle, so it always renders
 *      — even if Supabase is down, the network is blocked, or the table
 *      has not been seeded yet.
 *   2. Supabase is overlaid on top: any *additional* posts published via
 *      the admin dashboard (i.e. slugs not already in SEED_POSTS) are
 *      appended. This lets ops publish new posts without redeploying.
 *   3. Supabase is NOT allowed to *replace* a seed post. If the row in
 *      Supabase differs from SEED_POSTS (e.g. older excerpt), the seed
 *      wins. This is intentional: the bundle is the canonical version,
 *      and admins update SEED_POSTS in code (via the mirror rule).
 *
 * Sort: newest published_at first; entries without a date fall to the
 * bottom in their original order.
 */
export default function BlogListPage() {
  const [posts, setPosts] = useState(SEED_POSTS);
  const [loading, setLoading] = useState(false);
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
        if (cancelled) return;
        if (!data || data.length === 0) {
          // Supabase returned nothing — keep SEED_POSTS as-is.
          setLoading(false);
          return;
        }
        // Build slug index of seeds. Seed posts win; Supabase only adds.
        const seedSlugs = new Set(SEED_POSTS.map((p) => p.slug));
        const extras = data.filter((p) => !seedSlugs.has(p.slug));
        if (extras.length === 0) {
          // Supabase had posts but they were all already in the seed —
          // nothing to add. Keep the seed order.
          setLoading(false);
          return;
        }
        // Merge: seeds first (canonical), then Supabase extras (admin-only),
        // then sort the whole list by published_at desc.
        const merged = [...SEED_POSTS, ...extras].sort((a, b) => {
          const da = a.published_at ? new Date(a.published_at).getTime() : 0;
          const db = b.published_at ? new Date(b.published_at).getTime() : 0;
          return db - da;
        });
        setPosts(merged);
      } catch {
        // Network error / Supabase unreachable — keep SEED_POSTS.
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
