declare module "virtual:posts" {
  export const posts: unknown[];
  export const postBodies: Record<string, unknown[]>;
  export const postText: Record<string, string>;
  export const categories: { name: string; count: number }[];
  export const tags: { name: string; count: number }[];
  export const seriesGroups: {
    category: string;
    items: { name: string; slug: string; count: number }[];
  }[];
}
