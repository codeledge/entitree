import {
  CHILD_BOOKMARK_SYMBOL,
  PARENT_BOOKMARK_SYMBOL,
  SIBLING_BOOKMARK_SYMBOL,
  SPOUSE_BOOKMARK_SYMBOL,
} from "constants/bookmarks";
import {
  toggleChildren,
  toggleParents,
  toggleSiblings,
  toggleSpouses,
} from "actions/treeActions";

import { EntityNode } from "types/EntityNode";
import { useAppDispatch } from "store";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useBookmarks(node: EntityNode) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    //Expand bookmarks, applies only to non-root
    const bookmark = router.query?.[node.treeId!];
    if (node.wikidataId && bookmark && !node.isRoot) {
      if (bookmark?.indexOf(CHILD_BOOKMARK_SYMBOL) > -1) {
        dispatch(toggleChildren(node, { followNavigation: false }));
      }
      if (bookmark?.indexOf(PARENT_BOOKMARK_SYMBOL) > -1) {
        dispatch(toggleParents(node, { followNavigation: false }));
      }
      if (bookmark?.indexOf(SIBLING_BOOKMARK_SYMBOL) > -1) {
        dispatch(toggleSiblings(node, { followNavigation: false }));
      }
      if (bookmark?.indexOf(SPOUSE_BOOKMARK_SYMBOL) > -1) {
        dispatch(toggleSpouses(node, { followNavigation: false }));
      }
    }
  }, []);
}
