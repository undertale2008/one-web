import { Link } from "react-router-dom";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

type Props = {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
};

/** 分页条：首尾页 + 当前页附近，最多显示 5 个页码。 */
export function Pagination({ current, total, hrefFor }: Props) {
  if (total <= 1) return null;

  const windowSize = 5;
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav
      className="mx-auto onload-animation flex justify-center"
      style={{ animationDelay: "calc(var(--content-delay) + 400ms)" }}
      aria-label="分页"
    >
      <div className="pagination-shell inline-flex items-center gap-1 rounded-full p-1.5 font-bold text-neutral-700 dark:text-neutral-300">
        {current > 1 ? (
          <Link
            to={hrefFor(current - 1)}
            aria-label="上一页"
            className="pagination-item pagination-arrow"
          >
            <CaretLeft weight="bold" className="text-[1.4rem]" />
          </Link>
        ) : (
          <span
            aria-label="上一页"
            aria-disabled="true"
            className="pagination-item pagination-arrow is-disabled"
          >
            <CaretLeft weight="bold" className="text-[1.4rem]" />
          </span>
        )}

        {pages.map((page) =>
          page === current ? (
            <span key={page} aria-current="page" className="pagination-item is-current">
              {page}
            </span>
          ) : (
            <Link
              key={page}
              to={hrefFor(page)}
              aria-label={`第 ${page} 页`}
              className="pagination-item"
            >
              {page}
            </Link>
          )
        )}

        {current < total ? (
          <Link to={hrefFor(current + 1)} aria-label="下一页" className="pagination-item pagination-arrow">
            <CaretRight weight="bold" className="text-[1.4rem]" />
          </Link>
        ) : (
          <span
            aria-label="下一页"
            aria-disabled="true"
            className="pagination-item pagination-arrow is-disabled"
          >
            <CaretRight weight="bold" className="text-[1.4rem]" />
          </span>
        )}
      </div>
    </nav>
  );
}
