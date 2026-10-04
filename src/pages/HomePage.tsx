import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { posts } from "../content/posts";
import { Sidebar } from "../components/home/Sidebar";
import { PostCard } from "../components/home/PostCard";
import { Pagination } from "../components/home/Pagination";

const PER_PAGE = 5;

export function HomePage() {
  const [params] = useSearchParams();
  const requested = Number(params.get("page") ?? "1");
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = Number.isFinite(requested)
    ? Math.min(Math.max(1, Math.trunc(requested)), totalPages)
    : 1;

  const pagePosts = useMemo(
    () => posts.slice((current - 1) * PER_PAGE, current * PER_PAGE),
    [current]
  );

  return (
    <>
      <Sidebar />
      <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden lg:col-span-1">
        <div id="content-wrapper" className="onload-animation">
          <div className="post-list transition flex flex-col gap-3.5 md:gap-4 mb-4">
            {pagePosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
          <Pagination
            current={current}
            total={totalPages}
            hrefFor={(page) => (page === 1 ? "/" : `/?page=${page}`)}
          />
        </div>
      </main>
    </>
  );
}
