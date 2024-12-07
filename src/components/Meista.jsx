import React from 'react';
import koirakuva from '../assets/kuvat/meista-kuva.jpg';

function Meista() {
  return (
    <div className="bg">
      <div className="meista-container">


        <div className="meista-container-bg">

          <img
            src={koirakuva}
            alt="Koira"
            className='heading-image'
          />

          <div className="intro-section">


            <div className="intro-text">
              <h1 className="meista-heading2">Omppu & ranen tarina</h1>
              <p>
                Tervetuloa Lemmikkitarvikeverkkokauppaan – paikkaan, jossa lemmikit ja heidän tarpeensa ovat sydämemme asia!
              </p>
            </div>
          </div>
          <hr />
          <div className="about-content">
            <p>
              Vuonna 2024 kahden hännänheiluttajan, Omppu ja Rane -koirien intohimo parempaan lemmikinelämään synnytti tämän verkkokaupan. Omppu, joka tunnetaan uteliaana innovoijana, ja Rane, käytännöllisyyden mestari, päättivät yhdistää voimansa tarjotakseen korkealaatuisia ja huolella valikoituja tarvikkeita kaikille karvaisille, höyhenpeitteisille ja suomukkaisille ystävillemme.
            </p>
            <p>
              Meidän tavoitteemme on tehdä lemmikkien elämästä onnellisempaa ja omistajien arjesta sujuvampaa. Jokainen tuotteemme on testattu ja hyväksytty Ompun ja Ranen tiukkojen standardien mukaisesti – nämä nelijalkaiset yrittäjät tietävät, mitä lemmikit oikeasti tarvitsevat ja rakastavat!
            </p>
            <p>
              Valikoimamme kattaa kaiken leluista, herkuista ja hoitotuotteista aina käytännöllisiin tarvikkeisiin, jotka sopivat jokaisen lemmikin ja omistajan elämäntyyliin. Lisäksi olemme sitoutuneet kestävyyteen ja ympäristöystävällisyyteen – haluamme huolehtia myös planeetastamme.
            </p>
          </div>

          <div className="contact-section">
            <h3>Yhteystiedot:</h3>
            <p>
              Lemmikkitarvikeverkkokauppa<br />
              Karvakuonokatu 12<br />
              00100 Helsinki
            </p>
            <p>
              Y-tunnus: 1234567-8
            </p>

            <p>
              Jos sinulla on kysyttävää, palautetta tai tarvitset apua tilauksesi kanssa, älä epäröi ottaa meihin yhteyttä!
            </p>

            <p>
              Sähköposti: <a href="mailto:asiakaspalvelu@lemmikkitarvike.fi" className="email-link">asiakaspalvelu@lemmikkitarvike.fi</a><br />
              Puhelin: 040-1234567
            </p>

            <p>
              Kiitos, että valitsit Lemmikkitarvikeverkkokaupan – yhdessä teemme lemmikkien elämästä parempaa! 🐾
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meista;
