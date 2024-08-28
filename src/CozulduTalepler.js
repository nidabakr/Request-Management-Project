import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CozulduTalepler.css';

const CozulduTalepler = () => {
  const [talepler, setTalepler] = useState([]);

  useEffect(() => {
    fetch('http://10.34.4.71:5001/api/talepler')
      .then(response => response.json())
      .then(data => setTalepler(data.filter(talep => talep.Durum === 'Çözüldü')))
      .catch(error => console.error('Veri çekme hatası:', error));
  }, []);

  return (
    <div className="cozuldu-talepler">
      <h2>Çözülen Talepler</h2>
      <table>
        <thead>
          <tr>
            <th>Talep Başlığı</th>
            <th>Açıklama</th>
            <th>Notlar</th>
            <th>Şirket Adı</th>
            <th>Personel Adı</th>
          </tr>
        </thead>
        <tbody>
          {talepler.map(talep => (
            <tr key={talep.TalepID}>
              <td>{talep.TalepBasligi}</td>
              <td>{talep.TalepAciklamasi}</td>
              <td>{talep.Notlar}</td>
              <td>
                <Link to={`/Musteriler/${talep.SirketID}`}>{talep.SirketAdi}</Link>
              </td>
              <td>{talep.PersonelAdi} {talep.PersonelSoyadi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CozulduTalepler;
