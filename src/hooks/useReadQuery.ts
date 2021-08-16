import ReactGA from "react-ga";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { setSetting } from "../store/settingsSlice";
import { useDispatch } from "react-redux";
import { THEMES } from "constants/themes";

export default function useReadQuery() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Router.router?.query.theme) {
      //check if theme exists
      const reqTheme = THEMES.find(({ code }) => Router.router?.query.theme === code);
      console.log(reqTheme);
      if (reqTheme) {
        dispatch(
          setSetting({ key: "themeCode", val: reqTheme.code }),
        );
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
