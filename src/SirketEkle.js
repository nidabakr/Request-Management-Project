import './SirketEkle.css';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';

const emailDomains = [
  '@gmail.com',
  '@outlook.com',
  '@hotmail.com',
];

const SirketEkle = () => {
  const [formData, setFormData] = useState({
    SirketAdi: '',
    Eposta: '',
    Ulke: '', 
    Sehir: ''
  });

  const [emailInput, setEmailInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Eposta') {
      setEmailInput(value);
      const lastAtIndex = value.lastIndexOf('@');
      const inputBeforeAt = value.slice(0, lastAtIndex);
      const domainPart = value.slice(lastAtIndex);

      if (lastAtIndex !== -1) {
        const filteredSuggestions = emailDomains
          .filter(domain => domain.startsWith(domainPart))
          .map(domain => inputBeforeAt + domain);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, Eposta: suggestion });
    setSuggestions([]);
    setEmailInput(suggestion); 
  };

  const fetchCountries = async (inputValue) => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    const filteredCountries = data
      .filter(country => {
        if (inputValue.toLowerCase() === 'türkiye' && country.name.common === 'Turkey') {
          return true;
        }
        return country.name.common.toLowerCase().includes(inputValue.toLowerCase());
      })
      .map(country => ({
        value: country.cca2,
        label: country.name.common === 'Turkey' ? 'Türkiye' : country.name.common
      }));

    // Türkiye'yi listenin en üstüne koy
    const turkeyIndex = filteredCountries.findIndex(country => country.value === 'TR');
    if (turkeyIndex > -1) {
      const [turkey] = filteredCountries.splice(turkeyIndex, 1);
      filteredCountries.unshift(turkey);
    }

    return filteredCountries;
  };

  const handleCountryChange = (selectedOption) => {
    setFormData(prevData => ({
      ...prevData,
      Ulke: selectedOption ? selectedOption.label : '',
      UlkeCode: selectedOption ? selectedOption.value : '',  
      Sehir: '' 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.34.4.71:5001/api/Musteriler', {
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
      console.log('Başarıyla eklenen şirket:', result);
      alert('Şirket başarıyla eklendi.');
      setFormData({
        SirketAdi: '',
        Eposta: '',
        Ulke: '',
        UlkeCode: '', 
        Sehir: '',
      });
      navigate('/');
    } catch (error) {
      console.error('Veri eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="sirket-ekle-container">
      <h2 className="sirket-ekle-title">Yeni Şirket Ekle</h2>
      <form onSubmit={handleSubmit} className="sirket-ekle-form">
        <div>
          <label htmlFor="SirketAdi" className="sirket-ekle-form-label">Şirket Adı:</label>
          <input
            type="text"
            id="SirketAdi"
            name="SirketAdi"
            value={formData.SirketAdi}
            onChange={handleChange}
            className="sirket-ekle-form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="Eposta" className="sirket-ekle-form-label">E-posta:</label>
          <input
            type="text"
            id="Eposta"
            name="Eposta"
            value={emailInput}
            onChange={handleChange}
            className="sirket-ekle-form-input"
            placeholder="E-posta adresi girin..."
            required
          />
          {suggestions.length > 0 && (
            <ul className="email-suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="Ulke" className="sirket-ekle-form-label">Ülke:</label>
          <AsyncSelect
            cacheOptions
            loadOptions={fetchCountries}
            defaultOptions
            onChange={handleCountryChange}
            className="sirket-ekle-form-select"
            placeholder="Ülke girin..."
            isClearable
          />
        </div>
        <div>
          <label htmlFor="Sehir" className="sirket-ekle-form-label">Şehir:</label>
          <input
            type="text"
            id="Sehir"
            name="Sehir"
            value={formData.Sehir}
            onChange={handleChange}
            className="sirket-ekle-form-input"
            placeholder="Şehir girin..."
          />
        </div>
        <button type="submit" className="sirket-ekle-form-button">Kaydet</button>
      </form>
    </div>
  );
};

export default SirketEkle;
