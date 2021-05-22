import Footer from "layout/Footer";
import Header from "../layout/Header";
import React from "react";
import SearchBar from "layout/SearchBar";
import styled from "styled-components";

export default function Home() {
  return (
    <div>
      <Header />
      <SearchBar />
      <main>
        hello <Title>Entitree</Title>
      </main>

      <Footer />
    </div>
  );
}

const Title = styled.h1`
  color: red;
`;
