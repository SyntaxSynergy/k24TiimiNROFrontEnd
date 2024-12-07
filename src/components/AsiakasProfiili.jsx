import customerProfileImage from '../assets/kuvat/tunnus.png';
function AsiakasProfiili() {

    return (
      <div className="bg">
      <div className='asiakasprofiili-container'>
        
      <h1 className='h1-heading'>Asiakasprofiili <span className="material-symbols-outlined tassu">
          account_circle
          </span></h1>
    <div className="asiakasprofiili-container-bg">
      <div className="header-section">
        <img
          src={customerProfileImage}
          alt="Customer Profile"
          className="profile-image"
        />

      </div>
      <hr className="divider" />
      <div className="content-section">
        <h2 className="subtitle">Haluatko poistaa tietosi?</h2>
        <p className="description">
          Ota yhteyttä asiakaspalveluumme. Me autamme mielellämme!
        </p>
        <a
          href="mailto:asiakaspalvelu@lemmikkitarvike.fi"
          className="email-link"
        >
          asiakaspalvelu@lemmikkitarvike.fi
        </a>
      </div>
    </div>
      </div>
      </div>
    );
  }
  
  export default AsiakasProfiili;