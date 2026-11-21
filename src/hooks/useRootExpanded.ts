import {
  toggleChildren,
  toggleParents,
  toggleSiblings,
  toggleSpouses,
} from "actions/treeActions";

import { EntityNode } from "types/EntityNode";
import { useAppDispatch } from "store";
import { useEffect } from "react";

export default function useRootExpanded(node: EntityNode) {
  const dispatch = useAppDispatch();

  //Make sure root is expanded by default
  useEffect(() => {
    if (node.isRoot) {
      dispatch(toggleChildren(node, { followNavigation: false }));
      dispatch(toggleParents(node, { followNavigation: false }));
      dispatch(toggleSiblings(node, { followNavigation: false }));
      dispatch(toggleSpouses(node, { followNavigation: false }));
    }
  }, []);
}
