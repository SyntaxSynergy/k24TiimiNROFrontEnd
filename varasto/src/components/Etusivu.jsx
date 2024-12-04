import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';

import ExampleCarouselImage1 from '../assets/kuvat/etusivu-pic-1.jpg';
import ExampleCarouselImage2 from '../assets/kuvat/etusivu-pic-2.jpg';
import ExampleCarouselImage3 from '../assets/kuvat/etusivu-pic-3.jpg';

import ExampleCarouselImageMobile1 from '../assets/kuvat/etusivu-pic-1-mobiili.jpg';
import ExampleCarouselImageMobile2 from '../assets/kuvat/etusivu-pic-2-mobiili.jpg';
import ExampleCarouselImageMobile3 from '../assets/kuvat/etusivu-pic-3-mobiili.jpg';

function Etusivu() {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Carousel className='carousel'>
        <Carousel.Item interval={5000}>
          <img
            className="d-block w-100"
            src={isMobile ? ExampleCarouselImageMobile1 : ExampleCarouselImage1}
            alt="First slide"
          />

        </Carousel.Item>

        <Carousel.Item interval={5000}>
          <img
            className="d-block w-100"
            src={isMobile ? ExampleCarouselImageMobile2 : ExampleCarouselImage2}
            alt="Second slide"
          />

        </Carousel.Item>

        <Carousel.Item interval={5000}>
          <img
            className="d-block w-100"
            src={isMobile ? ExampleCarouselImageMobile3 : ExampleCarouselImage3}
            alt="Third slide"
          />

        </Carousel.Item>
      </Carousel>

      <div className="etusivu-container">
        <span class="material-symbols-outlined tassu-etusivu">pets</span>
        <h1 className='etusivu-h1'>Tutustu tuotteisiimme</h1>
        <p className='etusivu-p'>Meiltä löydät laajan valikoiman korkealaatuisia tuotteita, jotka tukevat lemmikkisi hyvinvointia ja elämänlaatua. Tarjoamme ruokia, tarvikkeita ja lisävarusteita kaikille lemmikeille – koirista kissoihin ja pieneläimiin.</p>
        <a className="tuotteet-button" href="/Tuotteet">tuotteet</a>

      </div>
    </>
  );
}

export default Etusivu;
