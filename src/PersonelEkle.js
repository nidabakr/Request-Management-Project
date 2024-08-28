import React, { useState } from 'react';
import './PersonelEkle.css';
import { useNavigate } from 'react-router-dom'

const PersonelEkle = () => {
  const [formData, setFormData] = useState({
    PersonelAdi: '',
    PersonelSoyadi: '',
    Departman: ''
  });
  
const navigate= useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.34.4.71:5001/api/Personel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData) 
      });

      if (!response.ok) {
    
        const errorText = await response.text();
        throw new Error(`Veri ekleme başarısız oldu: ${errorText}`);
      }

      const result = await response.json();
      console.log('Başarıyla eklenen personel:', result);
      alert('Personel başarıyla eklendi.');
      setFormData({
        PersonelAdi: '',
        PersonelSoyadi: '',
        Departman: ''
      });
      navigate('/');
    } catch (error) {
      console.error('Veri eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="personel-ekle-container">
      <h2 className="personel-ekle-title">Yeni Personel Ekle</h2>
      <form onSubmit={handleSubmit} className="personel-ekle-form">
        <div>
          <label htmlFor="PersonelAdi" className="personel-ekle-form-label">Personel Adı:</label>
          <input
            type="text"
            id="PersonelAdi"
            name="PersonelAdi"
            value={formData.PersonelAdi}
            onChange={handleChange}
            className="personel-ekle-form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="PersonelSoyadi" className="personel-ekle-form-label">Personel Soyadı:</label>
          <input
            type="text"
            id="PersonelSoyadi"
            name="PersonelSoyadi"
            value={formData.PersonelSoyadi}
            onChange={handleChange}
            className="personel-ekle-form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="Departman" className="personel-ekle-form-label">Departman:</label>
          <input
            type="text"
            id="Departman"
            name="Departman"
            value={formData.Departman}
            onChange={handleChange}
            className="personel-ekle-form-input"
            required
          />
        </div>
        <button type="submit" className="personel-ekle-form-button">Kaydet</button>
      </form>
    </div>
  );
};

export default PersonelEkle;
