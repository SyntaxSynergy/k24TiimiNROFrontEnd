import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
  const [lataus, setLataus] = useState(true);
  const [virhe, setVirhe] = useState(null);
  const [valmistajat, setValmistajat] = useState([]);
  const [valittuValmistaja, setValittuValmistaja] = useState('');

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_PRODUCTS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Verkkovastaus ei ollut kunnossa');
        }
        return response.json();
      })
      .then((data) => {
        const haetutTuotteet = data._embedded.tuotes;

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

        Promise.all(tuotteetValmistajilla)
          .then((tuotteetValmistajillaData) => {
            setKaikkiTuotteet(tuotteetValmistajillaData);
            setTuotteet(tuotteetValmistajillaData);
            setLataus(false);

            const uniikitValmistajat = [
              ...new Set(tuotteetValmistajillaData.map((tuote) => tuote.valmistaja)),
            ];
            setValmistajat(uniikitValmistajat);
          })
          .catch((error) => {
            console.error('Error processing valmistajat:', error);
            setVirhe('Valmistajien haku epäonnistui');
          });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setVirhe('Tuotteiden haku epäonnistui');
        setLataus(false);
      });
  }, []);

  const handleValmistajaMuutos = (event) => {
    const valittu = event.target.value;
    setValittuValmistaja(valittu);

    if (valittu === '') {
      setTuotteet(kaikkiTuotteet);
    } else {
      const suodatetutTuotteet = kaikkiTuotteet.filter((tuote) => tuote.valmistaja === valittu);
      setTuotteet(suodatetutTuotteet);
    }
  };

  if (lataus) {
    return (
      <div className="loading">
        <Spin size="large" />
      </div>
    );
  }

  if (virhe) {
    return <div className="error">Virhe: {virhe}</div>;
  }

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


      <div className='grid-bg'>
        <div className="products-grid">
          {tuotteet.length === 0 ? (
            <p>Ei tuotteita löytynyt.</p>
          ) : (
            tuotteet.map((tuote) => (
              <div className="product-card" key={tuote._links.self.href}>



                <div className="icon-container">
                  <span
                    className="material-symbols-outlined product-icon"
                    style={{ fontSize: '5rem', color: tyyppiColors[tuote.tyyppiNimi] || '#555' }}
                  >
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
                    <div className='hinta-osta'>
                      <span className="material-symbols-outlined shopping" >
                        shopping_cart
                      </span>
                      <p>Osta tuote</p>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>



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
