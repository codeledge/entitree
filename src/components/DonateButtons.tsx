import Script from "next/script";
import styled from "styled-components";

export default function DonateButtons() {
  return (
    <ButtonsContainer>
      <div>
        <div id="gbp-donate-button-container">
          <div id="gbp-donate-button" />
          <Script>
            {`
              PayPal.Donation.Button({
                env:'production',
                hosted_button_id:'MC7KHB7EAYQVS',
                image: {
                  src:'https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif',
                alt:'Donate with PayPal button',
                title:'PayPal - The safer, easier way to pay online!',
              }
              }).render('#gbp-donate-button');
          `}
          </Script>
        </div>
        <i>in £ (Pound)</i>
      </div>
      <div>
        <div id="eur-donate-button-container">
          <div id="eur-donate-button" />
          <Script>
            {`
              PayPal.Donation.Button({
                env:'production',
                hosted_button_id:'UCGVUMMYRQKX6',
                image: {
                  src:'https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif',
                alt:'Donate with PayPal button',
                title:'PayPal - The safer, easier way to pay online!',
              }
              }).render('#eur-donate-button');
          `}
          </Script>
        </div>
        <i>in € (Euro)</i>
      </div>
    </ButtonsContainer>
  );
}

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;
