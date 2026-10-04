import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "@phosphor-icons/react";
import { posts } from "../../content/posts";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 节日表（参考站覆盖到 2030 年），用于「距离 X 还有 N 天」那一行。 */
const FESTIVAL_TABLE: Record<string, [string, string][]> = {
  "2026": [
    ["春节", "2026-02-17"],
    ["端午节", "2026-06-19"],
    ["七夕", "2026-08-19"],
    ["中秋节", "2026-09-25"],
    ["重阳节", "2026-10-18"],
  ],
  "2027": [
    ["春节", "2027-02-06"],
    ["端午节", "2027-06-09"],
    ["七夕", "2027-08-08"],
    ["中秋节", "2027-09-15"],
    ["重阳节", "2027-10-08"],
  ],
  "2028": [
    ["春节", "2028-01-26"],
    ["端午节", "2028-06-15"],
    ["七夕", "2028-08-19"],
    ["中秋节", "2028-10-03"],
    ["重阳节", "2028-10-29"],
  ],
  "2029": [
    ["春节", "2029-02-13"],
    ["端午节", "2029-06-05"],
    ["七夕", "2029-08-07"],
    ["中秋节", "2029-09-22"],
    ["重阳节", "2029-10-17"],
  ],
  "2030": [
    ["春节", "2030-02-03"],
    ["端午节", "2030-06-25"],
    ["七夕", "2030-08-03"],
    ["中秋节", "2030-09-12"],
    ["重阳节", "2030-10-07"],
  ],
};

const FESTIVALS = Object.values(FESTIVAL_TABLE)
  .flat()
  .map(([name, date]) => ({ name, date }))
  .sort((a, b) => (a.date < b.date ? -1 : 1));

const pad = (value: number) => String(value).padStart(2, "0");
const keyOf = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

export function SiteCalendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));

  const postsByDate = useMemo(() => {
    const map = new Map<string, typeof posts>();
    posts.forEach((post) => {
      const list = map.get(post.date) ?? [];
      list.push(post);
      map.set(post.date, list);
    });
    return map;
  }, []);

  const days = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const startPad = first.getDay();
    const total = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const cells: (number | null)[] = Array.from({ length: startPad }, () => null);
    for (let day = 1; day <= total; day += 1) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return FESTIVALS.find((item) => new Date(`${item.date}T00:00:00`) >= new Date(now.toDateString())) ?? FESTIVALS[0];
  }, []);

  const shift = (delta: number) => {
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const isCurrentMonth = cursor.year === today.getFullYear() && cursor.month === today.getMonth();

  return (
    <div className="calendar-widget">
      <div className="calendar-heading">
        <button type="button" onClick={() => shift(-1)} aria-label="上个月">
          ‹
        </button>
        <div className="calendar-heading-center">
          <strong>{`${cursor.year}年${cursor.month + 1}月`}</strong>
          <button
            type="button"
            className="calendar-current-month"
            hidden={isCurrentMonth}
            onClick={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}
          >
            返回本月
          </button>
        </div>
        <button type="button" onClick={() => shift(1)} aria-label="下个月">
          ›
        </button>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-days">
        {days.map((day, index) => {
          if (day === null) return <span className="calendar-empty" key={`empty-${index}`} />;
          const dateKey = keyOf(cursor.year, cursor.month, day);
          const dayPosts = postsByDate.get(dateKey);
          const isToday =
            day === today.getDate() && cursor.month === today.getMonth() && cursor.year === today.getFullYear();

          return (
            <span
              key={dateKey}
              className={`calendar-day ${dayPosts ? "has-posts" : ""} ${isToday ? "is-today" : ""}`}
              tabIndex={dayPosts ? 0 : -1}
            >
              {day}
              {dayPosts && <span className="calendar-post-marker" aria-hidden="true" />}
              {dayPosts && (
                <span className="calendar-post-popover">
                  {dayPosts.map((post) => (
                    <Link key={post.slug} to={`/posts/${post.slug}/`}>
                      {post.title}
                      <small>{post.readingMinutes} 分钟</small>
                    </Link>
                  ))}
                </span>
              )}
            </span>
          );
        })}
      </div>

      <div className="calendar-holiday">
        <Star weight="fill" className="calendar-holiday-icon" aria-hidden="true" />
        <span>
          距离<strong>{upcoming.name}</strong> 还有{" "}
          {Math.max(
            0,
            Math.round(
              (new Date(`${upcoming.date}T00:00:00`).getTime() - new Date(today.toDateString()).getTime()) /
                86_400_000
            )
          )}{" "}
          天
        </span>
      </div>
    </div>
  );
}
