import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

const Tuotteet = () => {
  const [tuotteet, setTuotteet] = useState([]);
  const [kaikkiTuotteet, setKaikkiTuotteet] = useState([]);
  const [valmistajat, setValmistajat] = useState([]);
  const [valittuValmistaja, setValittuValmistaja] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // alusta asiakastiedot
  const [customerInfo, setCustomerInfo] = useState({
    sukunimi: '',
    etunimi: '',
    puhelinnumero: '',
    sahkoposti: '',
    katuosoite: '',
    postinumero: '',
    postitoimipaikka: ''
  });

  // Utility function for fetch error handling
  const handleFetchError = (response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  // fetchaa tuotteet ja tuotteelle kuuluva valmistaja
  useEffect(() => {
    fetch(process.env.REACT_APP_API_PRODUCTS_URL)
      .then(handleFetchError)
      .then((data) => {
        const haetutTuotteet = data._embedded.tuotes;

        // Haetaan jokaisen tuotteen valmistaja (valmistaja)
        const tuotteetValmistajilla = haetutTuotteet.map((tuote) => {
          return fetch(tuote._links.valmistaja.href)
            .then(handleFetchError)
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

            // Haetaan lista uniikeista valmistajista
            const uniikitValmistajat = [
              ...new Set(tuotteetValmistajillaData.map((tuote) => tuote.valmistaja)),
            ];
            setValmistajat(uniikitValmistajat);
          });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
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

  // funktio tekstikenttien muutosten käsittelyyn
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  //funktio asiakkaan ja tuotteen id:n erottamiseen urli:sta
  const extractIdFromUrl = (url) => {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };

  // funktio tilauksen ja asiakkaan tallentamiseen taulukoihin. Uuttaa asiakasta ei tallenneta, jos identtinen asiakas on jo olemassa.
  const handleTilaaSubmit = () => {
    // jos tuote on loppu, näytetään alert 'Product is out of stock' ja tilausta ei tehdä
    if (selectedProduct.varastomaara <= 0) {
      alert('Product is out of stock');
      return;
    }

    // fetchaa asiakkaat 
    fetch(process.env.REACT_APP_API_ASIAKASES_URL)
      .then(handleFetchError)
      .then(data => {
        const customers = data._embedded.asiakases;
        const existingCustomer = customers.find(customer =>
          customer.sukunimi === customerInfo.sukunimi &&
          customer.etunimi === customerInfo.etunimi &&
          customer.puhelinnumero === customerInfo.puhelinnumero &&
          customer.sahkoposti === customerInfo.sahkoposti &&
          customer.katuosoite === customerInfo.katuosoite &&
          customer.postinumero === customerInfo.postinumero &&
          customer.postitoimipaikka === customerInfo.postitoimipaikka
        );

        // tarkista onko asiakas jo olemassa
        // (jos on, kutsu extractIdFromUrl() ja palauta asiakasid)
        if (existingCustomer) {
          alert('Tilaus tehty onnistuneesti!');
          const asiakasid = extractIdFromUrl(existingCustomer._links.self.href);
          return asiakasid;
        }
        // (jos ei, POST uusi asiakas, kutsu extractIdFromUrl() ja palauta asiakasid)
        else {
          return fetch(process.env.REACT_APP_API_ASIAKASES_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerInfo)
          })
            .then(handleFetchError)
            .then(data => {
              const asiakasid = extractIdFromUrl(data._links.self.href);
              return asiakasid;
            });
        }
      })
      .then(asiakasid => {
        // extractIdFromUrl() tuotteen id
        const tuoteId = extractIdFromUrl(selectedProduct._links.self.href);

        const tilaus = {
          asiakas: { asiakasid: asiakasid },
          tuote: { tuoteId: tuoteId }
        };

        // POST uusi tilaus
        return fetch(process.env.REACT_APP_API_TILAUSES_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tilaus)
        });
      })
      .then(handleFetchError)
      .then(data => {
        // miinusta 1 tuotteen varastomäärästä
        const updatedProduct = { ...selectedProduct, varastomaara: selectedProduct.varastomaara - 1 };

        // PUT päivitetty varastomäärä tuotteeseen
        return fetch(selectedProduct._links.self.href, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProduct)
        });
      })
      .then(handleFetchError)
      // ilmoitus onnistuneesta tilauksesta ja tilaus ikkunan sulkeminen
      .then(data => {
        console.log('Order created successfully:', data);
        alert('Order created successfully!');
        setShowPopup(false);

        // fetchaa uusi tuotelista päivitettyjen varastomäärien kanssa tilauksen tekemisen jälkeen
        fetch(process.env.REACT_APP_API_PRODUCTS_URL)
          .then(handleFetchError)
          .then((data) => {
            const haetutTuotteet = data._embedded.tuotes;

            // Haetaan jokaisen tuotteen valmistaja (valmistaja)
            const tuotteetValmistajilla = haetutTuotteet.map((tuote) => {
              return fetch(tuote._links.valmistaja.href)
                .then(handleFetchError)
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

                // Haetaan lista uniikeista valmistajista
                const uniikitValmistajat = [
                  ...new Set(tuotteetValmistajillaData.map((tuote) => tuote.valmistaja)),
                ];
                setValmistajat(uniikitValmistajat);
              });
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
          });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was a problem with the fetch operation: ' + error.message);
      });
  };

  // tallenna "tuote" selectedProductiin ja näytä popup form tilauksen tekoa varten
  const handleTilaaClick = (tuote) => {
    setSelectedProduct(tuote);
    setShowPopup(true);
  };

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
              <button onClick={() => handleTilaaClick(tuote)}>Tilaa</button>
            </div>
          ))
        )}
      </div>

      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>Tilaa tuote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Täytä alla olevat tiedot tilataksesi tuotteen.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="sukunimi"
            label="Sukunimi"
            type="text"
            fullWidth
            value={customerInfo.sukunimi}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="etunimi"
            label="Etunimi"
            type="text"
            fullWidth
            value={customerInfo.etunimi}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="puhelinnumero"
            label="Puhelinnumero"
            type="text"
            fullWidth
            value={customerInfo.puhelinnumero}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="sahkoposti"
            label="Sähköposti"
            type="text"
            fullWidth
            value={customerInfo.sahkoposti}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="katuosoite"
            label="Katuosoite"
            type="text"
            fullWidth
            value={customerInfo.katuosoite}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="postinumero"
            label="Postinumero"
            type="text"
            fullWidth
            value={customerInfo.postinumero}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            name="postitoimipaikka"
            label="Postitoimipaikka"
            type="text"
            fullWidth
            value={customerInfo.postitoimipaikka}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPopup(false)} color="primary">
            Peruuta
          </Button>
          <Button onClick={handleTilaaSubmit} color="primary">
            Tilaa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Tuotteet;