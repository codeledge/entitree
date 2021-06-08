import { createGlobalStyle } from "styled-components";

const DARK_COLOR = "#343a40";
const LIGHT_COLOR = "#fff";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  
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

  .dropdown-toggle::after {
    vertical-align: middle;
  }    

  .btn-link {
    text-decoration: none;
  }

  &.dark {

    background-color: ${DARK_COLOR};
    .Header {
      background-color: ${LIGHT_COLOR} !important;
      .navbar-brand {
        color: ${DARK_COLOR};
      }
      .settingsButton {
        background-color: ${DARK_COLOR};
      }
    }
    .SearchBar {
      background-color: ${DARK_COLOR};
      .dropdown-toggle {
        background-color: ${LIGHT_COLOR};
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

  hr {
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }

  .SettingsModalDialog {
    //or it will break on mobile
    @media screen and (min-width: 850px) {
      position: absolute;
      margin: 0;
      height: 100vh;
      right: 0;
    }
    .modal-content {
      height: 100%;
      overflow-y: auto;
      border-radius: 0;
      border: none;
    }
  }
`;
