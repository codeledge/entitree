import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  * {
    font-family: 'Open Sans', sans-serif;
  }
  

  .App {
    @media (min-width: 576px) {
      .container {
        padding-left: 0;
        padding-right: 0;
      }
    }

    .messages {
      position: fixed;
      z-index: 999;
      top: 62px;
      max-width: 90%;
      left: 50%;
      transform: translateX(-50%);
    }

    //This stuff should be in its own page!
    .examplesButton {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99;
    }

    .dropdown-toggle::after {
      vertical-align: middle;
    }
    .navbar-brand {
      margin-right: 0;
    }

    $darkColor: #343a40;

    &.dark {
      $lightColor: #eee;

      background-color: $darkColor;
      .Header {
        background-color: $lightColor !important;
        .navbar-brand {
          color: $darkColor;
        }
        .settingsButton {
          background-color: $darkColor;
        }
      }
      .SearchBar {
        background-color: $darkColor;
        .dropdown-toggle {
          background-color: $lightColor;
        }
      }
      .Node {
        background-color: #111;
        box-shadow: 4px 4px 10px #111;
        &.focused {
          box-shadow: 0 0 12px white;
        }
        .description {
          color: white;
        }
        .dates {
          color: white;
        }
      }

      .Rel {
        stroke: #111;
      }
    }

    //dark mode
    //@media (prefers-color-scheme: dark) {
    //}
  }

  hr {
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }
`;
