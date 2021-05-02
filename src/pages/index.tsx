import Head from 'next/head';
import styled from 'styled-components';

export default function Home() {
  return (
    <div>
      <Head>
        <title>EntiTree - Grow your knowledge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        hello <Title>Entitree</Title>
      </main>

      <footer>footer</footer>
    </div>
  );
}

const Title = styled.h1`
  color: red;
`;
