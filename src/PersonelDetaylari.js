import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PersonelDetaylari.css';

const PersonelDetaylari = ({ PersonelID: propPersonelID, closeModal }) => {
  const { PersonelID: paramPersonelID } = useParams();
  const PersonelID = propPersonelID || paramPersonelID;
  const [personel, setPersonel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://10.34.4.71:5001/api/Personeller/${PersonelID}`)
      .then(response => response.json())
      .then(data => setPersonel(data))
      .catch(error => console.error('Veri çekme hatası:', error));
  }, [PersonelID]);

  if (!personel) return <div>Yükleniyor...</div>;

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="back-button" onClick={handleBackClick}>Geri</button> 
        <div className="personel-detaylari">
          <h2>{personel.PersonelAdi} {personel.PersonelSoyadi}</h2>
          <p><strong>Departman:</strong> {personel.Departman}</p>
          {closeModal && <button className="close-button" onClick={closeModal}>Kapat</button>}
        </div>
      </div>
    </div>
  );
};

export default PersonelDetaylari;
