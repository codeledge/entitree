import Div100vh from "react-div-100vh";
import styled from "styled-components";

export const Page = styled(Div100vh)`
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  flex-grow: 1;
  position: relative;
`;

export const Content = styled.div`
  max-width: 680px;
  margin: 0 auto;
`;
