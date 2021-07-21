import Router from "next/router";

export const addUrlBookmark = (treeId: string, symbol: string) => {
  let bookmark = Router.router?.query[treeId];
  // node bookmarked already
  if (bookmark) {
    // if symbol not found, add
    if (bookmark.indexOf(symbol) === -1) {
      bookmark += symbol;
    }
  } else {
    bookmark = symbol; //set
  }

  Router.push(
    {
      query: {
        ...Router.router?.query,
        [treeId]: bookmark,
      },
    },
    undefined,
    {
      shallow: true,
    },
  );
};
