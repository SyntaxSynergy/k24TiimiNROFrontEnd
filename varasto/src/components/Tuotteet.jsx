import React, { useEffect, useState } from 'react';

const Tuotteet = () => {
  const [tuotteet, setTuotteet] = useState([]);
  const [kaikkiTuotteet, setKaikkiTuotteet] = useState([]); 
  const [lataus, setLataus] = useState(true);
  const [virhe, setVirhe] = useState(null);
  const [valmistajat, setValmistajat] = useState([]); 
  const [valittuValmistaja, setValittuValmistaja] = useState(''); 

  useEffect(() => {
    fetch('https://syntaxbackend-f811444e58ce.herokuapp.com/api/tuotes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Verkkovastaus ei ollut kunnossa');
        }
        return response.json();
      })
      .then((data) => {
        const haetutTuotteet = data._embedded.tuotes;

        // Haetaan jokaisen tuotteen valmistaja (valmistaja)
        const tuotteetValmistajilla = haetutTuotteet.map((tuote) => {
          return fetch(tuote._links.valmistaja.href)
            .then((response) => response.json())
            .then((valmistajaData) => ({
              ...tuote,
              valmistaja: valmistajaData.valmistajaNimi,  // Poimitaan 'valmistajaNimi'
            }))
            .catch(() => ({
              ...tuote,
              valmistaja: 'Tuntematon valmistaja',  // Oletusarvo virheen sattuessa
            }));
        });

        // Kun kaikki valmistajatiedot on haettu, päivitetään tila
        Promise.all(tuotteetValmistajilla)
          .then((tuotteetValmistajillaData) => {
            setKaikkiTuotteet(tuotteetValmistajillaData);
            setTuotteet(tuotteetValmistajillaData);
            setLataus(false);

            // Haetaan lista uniikeista valmistajista
            const uniikitValmistajat = [
              ...new Set(tuotteetValmistajillaData.map((tuote) => tuote.valmistaja)),
            ];
            setValmistajat(uniikitValmistajat);
          });
      })
      .catch((error) => {
        setVirhe(error.message);
        setLataus(false);
      });
  }, []);

  // Käsitellään valmistajan valinta
  const handleValmistajaMuutos = (event) => {
    const valittu = event.target.value;
    setValittuValmistaja(valittu);

    if (valittu === '') {
      // Jos valmistajaa ei ole valittu, näytetään kaikki tuotteet
      setTuotteet(kaikkiTuotteet);
    } else {
      // Suodatetaan tuotteet valitun valmistajan mukaan
      const suodatetutTuotteet = kaikkiTuotteet.filter((tuote) => tuote.valmistaja === valittu);
      setTuotteet(suodatetutTuotteet);
    }
  };

  if (lataus) {
    return <div>Ladataan...</div>;
  }

  if (virhe) {
    return <div>Virhe: {virhe}</div>;
  }

  return (
    <div>
      <h1>Tuotteet</h1>

      <div>
        <label>Valitse valmistaja: </label>
        <select value={valittuValmistaja} onChange={handleValmistajaMuutos}>
          <option value="">Kaikki valmistajat</option>
          {valmistajat.map((valmistaja, index) => (
            <option key={index} value={valmistaja}>
              {valmistaja}
            </option>
          ))}
        </select>
      </div>

      <div>
        {tuotteet.length === 0 ? (
          <p>Ei tuotteita löytynyt.</p>
        ) : (
          tuotteet.map((tuote) => (
            <div key={tuote._links.self.href}>
              <h3>{tuote.nimi}</h3>
              <p>Väri: {tuote.vari}</p>
              <p>Hinta: {tuote.hinta} €</p>
              <p>Varastomäärä: {tuote.varastomaara}</p>
              <p>Koko: {tuote.koko || 'Ei kokoa'}</p>
              <p>Valmistaja: {tuote.valmistaja}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tuotteet;
