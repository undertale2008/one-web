declare global {
  interface Window {
    /** 由 index.html 在首屏写入：本次是不是刷新加载。 */
    __isPageReload?: boolean;
  }
}

export {};
