import Router, { useRouter } from "next/router";

import { THEMES } from "constants/themes";
import { setSetting } from "../store/settingsSlice";
import { useAppDispatch } from "store";
import { useEffect } from "react";

export default function useReadQuery() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Router.router?.query.theme) {
      //check if theme exists
      const reqTheme = THEMES.find(
        ({ code }) => Router.router?.query.theme === code,
      );
      if (reqTheme) {
        dispatch(setSetting({ themeCode: reqTheme.code }));
      }

      delete Router.router?.query.theme;

      Router.push(
        {
          query: Router.router?.query,
        },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [router.events]);
}
