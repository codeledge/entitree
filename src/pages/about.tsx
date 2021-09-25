import { Container } from "react-bootstrap";
import { FaGithub } from "react-icons/fa";
import Footer from "../layout/Footer";
import Head from "next/head";
import Header from "../layout/Header";
import React from "react";
import { SITE_NAME } from "../constants/meta";
import { Title } from "layout/Title";
import styled from "styled-components";

export default function AboutPage() {
  return (
    <Page>
      <Head>
        <title>About - {SITE_NAME}</title>
      </Head>
      <Header simple />
      <Container className="pb-5">
        <Title>About the project</Title>
        <p>
          This effort started in mid-2020 and is a merger of other{" "}
          <a href="https://www.wikidata.org/wiki/Wikidata:Tools/Visualize_data">
            wikidata visualisation tools
          </a>{" "}
          about trees, with some extra features that make it more usable and
          navigable.
        </p>
        <p>Our mission is to support the following people:</p>
        <ul>
          <li>
            researchers of any level that want to explore wikidata connections
            in a visual way{" "}
            <span role="img" aria-label="research icon">
              🧪
            </span>
          </li>
          <li>
            scientists that are keen to use an interactive taxonomy tree 🔬
          </li>
          <li>
            historians investigating royal families{" "}
            <span role="img" aria-label="crown icon">
              👑
            </span>
          </li>
          <li>
            students of any kind of discipline, that want to enrich they
            knowledge 🎓
          </li>
          <li>
            curious random and non English-speaking people from around the
            globe, thanks to the multilingual feature{" "}
            <span role="img" aria-label="world icon">
              🌎🌍🌏
            </span>
          </li>
          <li>
            Wikidata editors and contributors, especially if they are interested
            in spotting missing or duplicate links{" "}
            <span role="img" aria-label="nerd icon">
              🤓
            </span>
          </li>
        </ul>
        <p>
          Please feel free to get in touch with any member of the team, for
          technical queries or help around the user interface{" "}
          <a
            href="https://github.com/ogroppo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Orlando
          </a>{" "}
          is the right guy, for anything related to (wiki)data{" "}
          <a
            href="https://github.com/mshd"
            target="_blank"
            rel="noopener noreferrer"
          >
            Martin
          </a>{" "}
          will be more than happy to help you. Send an email to the whole team{" "}
          <a href="mailto:entitree.app@gmail.com" rel="noopener noreferrer">
            entitree.app@gmail.com
          </a>
          . You can follow us on{" "}
          <a
            href="https://twitter.com/EntitreeApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          too.
        </p>
        <p>
          If you notice any strange behaviour in the interface or you think
          something could be improved, by any means{" "}
          <a
            className="btn btn-sm bg-light"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/codeledge/entitree/issues"
          >
            <FaGithub /> report a bug!
          </a>
        </p>
        <p>
          Our visitors are very precious to us and are always in our minds while
          building this tool. If you could feel the love we have put in this
          project and you want to participate to the growth of the amazing
          community orbiting around Wikidata, please make a donation.
        </p>
        <div className="donateButtons">
          <div>
            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_top"
            >
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input
                type="hidden"
                name="hosted_button_id"
                value="MC7KHB7EAYQVS"
              />
              <input
                type="image"
                src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
              />
              <img
                alt=""
                src="https://www.paypal.com/en_GB/i/scr/pixel.gif"
                width="1"
                height="1"
              />
            </form>
            <i>in £ (Pound)</i>
          </div>
          <div>
            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_top"
            >
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input
                type="hidden"
                name="hosted_button_id"
                value="UCGVUMMYRQKX6"
              />
              <input
                type="image"
                src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
              />
              <img
                alt=""
                src="https://www.paypal.com/en_GB/i/scr/pixel.gif"
                width="1"
                height="1"
              />
            </form>
            <i>in € (Euro)</i>
          </div>
        </div>
      </Container>
      <Footer />
    </Page>
  );
}

const Page = styled.div`
  .donateButtons {
    display: flex;
    justify-content: space-around;
  }
`;
