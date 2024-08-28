import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SirketDetaylari.css';

const SirketDetaylari = ({ SirketID: propSirketID, closeModal }) => {
  const { SirketID: paramSirketID } = useParams();
  const SirketID = propSirketID || paramSirketID;
  const [sirket, setSirket] = useState(null);
  const navigate = useNavigate(); // useNavigate hook'unu kullanın

  useEffect(() => {
    fetch(`http://10.34.4.71:5001/api/Musteriler/${SirketID}`)
      .then(response => response.json())
      .then(data => setSirket(data))
      .catch(error => console.error('Veri çekme hatası:', error));
  }, [SirketID]);

  if (!sirket) return <div>Yükleniyor...</div>;

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="back-button" onClick={handleBackClick}>Geri</button>
        <div className="sirket-detaylari">
          <h2>{sirket.SirketAdi}</h2>
          <p><strong>E-posta:</strong> {sirket.Eposta}</p>
          <p><strong>Ülke:</strong> {sirket.Ulke}</p>
          <p><strong>Şehir:</strong> {sirket.Sehir}</p>
          {closeModal && <button className="close-button" onClick={closeModal}>Kapat</button>}
        </div>
      </div>
    </div>
  );
};

export default SirketDetaylari;
