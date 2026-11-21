import {
  preloadChildren,
  preloadParents,
  preloadSiblings,
  preloadSpouses,
} from "actions/treeActions";

import { EntityNode } from "types/EntityNode";
import { useAppDispatch } from "store";
import { useEffect } from "react";

export default function usePreload(node: EntityNode) {
  const dispatch = useAppDispatch();

  //preload connected nodes
  useEffect(() => {
    if (node.wikidataId && !node.isRoot) {
      dispatch(preloadChildren(node));
      dispatch(preloadParents(node));
      dispatch(preloadSiblings(node));
      dispatch(preloadSpouses(node));
    }
  }, []);
}
