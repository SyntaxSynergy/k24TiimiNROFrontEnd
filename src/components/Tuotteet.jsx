import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Spin } from 'antd';

const tyyppiIcons = {
  VAATE: 'checkroom',
  LELU: 'sports_volleyball',
  RUOKA: 'pet_supplies',
};
const tyyppiColors = {
  VAATE: '#87BB8C',  // vihreä
  LELU: 'rgba(89, 152, 183, 0.839)',  //sininen
  RUOKA: '#DE99A1',   // pinkki
};

const Tuotteet = () => {
  const [tuotteet, setTuotteet] = useState([]);
  const [kaikkiTuotteet, setKaikkiTuotteet] = useState([]);
  const [valmistajat, setValmistajat] = useState([]);
  const [valittuValmistaja, setValittuValmistaja] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Scroll to top when this component is mounted
    window.scrollTo(0, 0);
  }, []);


  //modal
  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
        const tuotteetValmistajilla = haetutTuotteet.map((tuote) =>
          fetch(tuote._links.valmistaja.href)
            .then((response) => response.json())
            .then((valmistajaData) => {
              return fetch(tuote._links.tyyppi.href)
                .then((response) => response.json())
                .then((tyyppiData) => ({
                  ...tuote,
                  valmistaja: valmistajaData.valmistajaNimi || 'Tuntematon valmistaja',
                  tyyppiNimi: tyyppiData.tyyppiNimi || 'UNKNOWN',
                }));
            })
            .catch(() => ({
              ...tuote,
              valmistaja: 'Tuntematon valmistaja',
              tyyppiNimi: 'UNKNOWN',
            }))
        );

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
            setLoading(false); 
          });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setLoading(false); 
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
    const segments = url.split('/');
    return segments.length > 0 ? segments[segments.length - 1] : null;
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
          alert('Tilaus on tehty onnistuneesti! Saat vahvistuksen sähköpostiisi. Lisäksi ilmoitamme sinulle erikseen, kun tilauksesi on noudettavissa myymälästämme.');
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
        alert('Tilaus on tehty onnistuneesti! Saat vahvistuksen sähköpostiisi. Lisäksi ilmoitamme sinulle erikseen, kun tilauksesi on noudettavissa myymälästämme.');
        setShowPopup(false);

        // fetchaa uusi tuotelista päivitettyjen varastomäärien kanssa tilauksen tekemisen jälkeen
        fetch(process.env.REACT_APP_API_PRODUCTS_URL)
          .then(handleFetchError)
          .then((data) => {
            const haetutTuotteet = data._embedded.tuotes;

            // Haetaan jokaisen tuotteen valmistaja (valmistaja)
            const tuotteetValmistajilla = haetutTuotteet.map((tuote) =>
              fetch(tuote._links.valmistaja.href)
                .then((response) => response.json())
                .then((valmistajaData) => {
                  return fetch(tuote._links.tyyppi.href)
                    .then((response) => response.json())
                    .then((tyyppiData) => ({
                      ...tuote,
                      valmistaja: valmistajaData.valmistajaNimi || 'Tuntematon valmistaja',
                      tyyppiNimi: tyyppiData.tyyppiNimi || 'UNKNOWN',
                    }));
                })
                .catch(() => ({
                  ...tuote,
                  valmistaja: 'Tuntematon valmistaja',
                  tyyppiNimi: 'UNKNOWN',
                }))
            );

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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };
  return (
    <div className="bg">
      
      <div className="catalog-container">
        <div className='tuotteet-header'>
          <h1 className='h1-heading'>Tuotteet <span class="material-symbols-outlined tassu">
            pets
          </span></h1>

          <FormControl
            sx={{
              width: '30vw',
              borderRadius: '8px',
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {

                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiMenuItem-root': {
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' },
              },

              '@media (max-width: 700px)': {
                width: '50vw',
              },
            }}

          >
            <InputLabel id="valmistaja-select-label">Valitse valmistaja</InputLabel>
            <Select
              labelId="valmistaja-select-label"
              id="valmistaja-select"
              value={valittuValmistaja}
              onChange={handleValmistajaMuutos}
              label="Valitse valmistaja"
            >

              <MenuItem value="">
                <em>Kaikki valmistajat</em>
              </MenuItem>

              {valmistajat.map((valmistaja, index) => (
                <MenuItem key={index} value={valmistaja}>
                  {valmistaja}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="grid-bg">

  {loading ? (
    <div className="loading">
      <Spin size="large" />
    </div>
  ) : (
    <div className="products-grid">
      {tuotteet.length === 0 ? (
        <p>Ei tuotteita löytynyt.</p>
      ) : (
        tuotteet.map((tuote) => (
                
                <div className="product-card" key={tuote._links.self.href}>
                  <div className="icon-container">
                    <span
                      className="material-symbols-outlined product-icon"
                      style={{ fontSize: '5rem', color: tyyppiColors[tuote.tyyppiNimi] || '#555' }}>
                      {tyyppiIcons[tuote.tyyppiNimi] || 'help_outline'}
                    </span>
                  </div>

                  <div className="product-info">
                    <div className='product-header'> <p>{tuote.nimi}</p>
                      <Button className="info-button" onClick={() => handleOpen(tuote)}>
                        <span className="material-symbols-outlined info">info</span>
                      </Button>
                    </div>

                    <hr className='tuote-divider-hr' />

                    <div className="google-shopping-banner">
                      <p className='hinta'> {tuote.hinta} €</p>
                      <div className='hinta-osta' onClick={() => handleTilaaClick(tuote)}>
                        <span className="material-symbols-outlined shopping" >shopping_cart</span>
                        <p className='ostaTuote'>Osta tuote</p>
                        </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
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

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h7" component="h2">
              {selectedProduct ? selectedProduct.nimi : 'Loading...'}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {selectedProduct ? (
                <>
                  <p>Väri: {selectedProduct.vari}</p>
                  <p>Varastomäärä: {selectedProduct.varastomaara}</p>
                  <p>Koko: {selectedProduct.koko || 'N/A'}</p>
                  <p>Valmistaja: {selectedProduct.valmistaja}</p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};


export default Tuotteet;