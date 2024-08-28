import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './TalepEkle.css';

const TalepEkle = () => {
  const [formData, setFormData] = useState({
    TalepBasligi: '',
    TalepAciklamasi: '',
    Durum: 'Beklemede',
    SirketID: '',
    PersonelID: '',
    Notlar: ''
  });

  const [Musteriler, setMusteriler] = useState([]);
  const [personeller, setPersoneller] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersoneller = async () => {
      try {
        const response = await fetch('http://10.34.4.71:5001/api/personeller');
        const data = await response.json();
        setPersoneller(data);
      } catch (error) {
        console.error('Personel verileri alınırken hata oluştu:', error);
      }
    };
    fetchPersoneller();
  }, []);

  useEffect(() => {
    const fetchMusteriler = async () => {
      try {
        const response = await fetch('http://10.34.4.71:5001/api/Musteriler');
        const data = await response.json();
        setMusteriler(data);
      } catch (error) {
        console.error('Şirket verileri alınırken hata oluştu:', error);
      }
    };
    fetchMusteriler();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.34.4.71:5001/api/talepler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Veri ekleme başarısız oldu.');
      alert('Talep başarıyla eklendi!');
      navigate('/');
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  return (
    <div className="talep-ekle-form-container">
      <h1 className="talep-ekle-form-title">Yeni Talep Ekle</h1>
      <form onSubmit={handleSubmit} className="talep-ekle-form">
        <div>
          <label className="talep-ekle-form-label">Talep Başlığı:</label>
          <input 
            type="text" 
            name="TalepBasligi" 
            value={formData.TalepBasligi} 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            className="talep-ekle-form-input"
            required 
          />
        </div>
        <div>
          <label className="talep-ekle-form-label">Açıklama:</label>
          <input 
            type="text" 
            name="TalepAciklamasi" 
            value={formData.TalepAciklamasi} 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            className="talep-ekle-form-input"
            required 
          />
        </div>
        <div>
          <label className="talep-ekle-form-label">Durum:</label>
          <select 
            name="Durum" 
            value={formData.Durum} 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            className="talep-ekle-form-select"
          >
            <option value="Beklemede">Beklemede</option>
            <option value="Çözüldü">Çözüldü</option>
            <option value="Acil">Acil</option>
          </select>
        </div>
        <div>
          <label className="talep-ekle-form-label">Şirket:</label>
          <Select
            name="SirketID"
            options={Musteriler.map(musteri => ({
              value: musteri.SirketID,
              label: musteri.SirketAdi
            }))}
            value={
              Musteriler.find(musteri => musteri.SirketID === formData.SirketID)
                ? {
                    value: formData.SirketID,
                    label: Musteriler.find(musteri => musteri.SirketID === formData.SirketID).SirketAdi,
                  }
                : null
            }
            onChange={(selectedOption) => handleChange('SirketID', selectedOption ? selectedOption.value : '')}
            className="talep-ekle-form-select"
            placeholder="Şirket ismi girin..."
            isClearable
          />
        </div>
        <div>
          <label className="talep-ekle-form-label">Personel:</label>
          <Select
            name="PersonelID"
            options={personeller.map(personel => ({
              value: personel.PersonelID,
              label: `${personel.PersonelAdi} ${personel.PersonelSoyadi}`
            }))}
            value={personeller.find(personel => personel.PersonelID === formData.PersonelID)
              ? {
                value: formData.PersonelID,
                label: `${personeller.find(personel => personel.PersonelID === formData.PersonelID).PersonelAdi}
                        ${personeller.find(personel => personel.PersonelID === formData.PersonelID).PersonelSoyadi}`
              }
            : null
            }
            onChange={(selectedOption) => handleChange('PersonelID', selectedOption ? selectedOption.value : '')}
            className="talep-ekle-form-select"
            placeholder="Personel ismi girin..."
            isClearable
          />
        </div>
        <div>
          <label className="talep-ekle-form-label">Notlar:</label>
          <input 
            type="text" 
            name="Notlar" 
            value={formData.Notlar} 
            onChange={(e) => handleChange(e.target.name, e.target.value)} 
            className="talep-ekle-form-input"
            required 
          />
        </div>
        <button type="submit" className="talep-ekle-form-button">Kaydet</button>
      </form>
    </div>
  );
};

export default TalepEkle;
