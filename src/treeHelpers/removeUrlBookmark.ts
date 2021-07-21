import Router from "next/router";

export const removeUrlBookmark = (treeId: string, symbol: string) => {
  const query = Router.router?.query;
  if (!query) return;
  const bookmark = query[treeId] as string;

  if (bookmark) {
    query[treeId] = bookmark.replace(symbol, "");
    if (!query[treeId]) delete query[treeId];
  }

  Router.push(
    {
      query,
    },
    undefined,
    {
      shallow: true,
    },
  );
};
