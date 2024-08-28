import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './TaleplerList.css';
import ConfirmModal from './ConfirmModal';

const TaleplerList = () => {
  const [talepler, setTalepler] = useState([]);
  const [personeller, setPersoneller] = useState([]);
  const [filteredTalepler, setFilteredTalepler] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTalep, setEditedTalep] = useState({});
  const [notification, setNotification] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    durum: '',
    sirket: '',
    personel: '',
    search: '' 
  });

  useEffect(() => {
    fetch('http://10.34.4.71:5001/api/talepler')
      .then(response => response.json())
      .then(data => {
        setTalepler(data);
        setFilteredTalepler(data); 
      })
      .catch(error => console.error('Error fetching data:', error));

    fetch('http://10.34.4.71:5001/api/personeller')
      .then(response => response.json())
      .then(data => setPersoneller(data))
      .catch(error => console.error('Error fetching personeller:', error));
  }, []);

  
  const filterTalepler = useCallback(() => {
    const filtered = talepler.filter(talep => {
      return (
        (filters.durum === '' || talep.Durum === filters.durum) &&
        (filters.sirket === '' || talep.SirketAdi === filters.sirket) &&
        (filters.personel === '' || `${talep.PersonelAdi} ${talep.PersonelSoyadi}` === filters.personel) &&
        (filters.search === '' || talep.TalepBasligi.toLowerCase().includes(filters.search.toLowerCase())) // Added search filter logic
      );
    });
    setFilteredTalepler(filtered);
  }, [talepler, filters]);

  useEffect(() => {
    filterTalepler();
  }, [filters, filterTalepler]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      const response = await fetch(`http://10.34.4.71:5001/api/talepler/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız oldu.');
      }

      setTalepler(prevTalepler => prevTalepler.filter(talep => talep.TalepID !== deleteId));
      setNotification('Veri başarıyla silindi.');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Veri silinirken hata oluştu:', error);
      setNotification('Silme işlemi başarısız oldu.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  const getDurumClass = (durum) => {
    if (durum === 'Acil') {
      return 'durum-acil';
    } else if (durum === 'Beklemede') {
      return 'durum-beklemede';
    } else if (durum === 'Çözüldü') {
      return 'durum-cozuldu';
    }
    return '';
  };

  const handleEditClick = (index, talep) => {
    setEditingIndex(index);
    setEditedTalep(talep);
  };

  const handleSaveClick = async (index) => {
    try {
      const response = await fetch(`http://10.34.4.71:5001/api/talepler/${editedTalep.TalepID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTalep),
      });
  
      if (!response.ok) {
        throw new Error('Güncelleme başarısız oldu.');
      }
  
      const updatedTalepler = [...talepler];
      updatedTalepler[index] = editedTalep;
      setTalepler(updatedTalepler);
      setEditingIndex(null);
      
      window.location.reload();
    } catch (error) {
      console.error('Veri güncellenirken hata oluştu:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTalep(prevTalep => ({
      ...prevTalep,
      [name]: value
    }));
  };

  return (
    <div className="talepler-listesi">
      <h1>TALEPLER LİSTESİ</h1>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Bu talebi silmek istediğinize emin misiniz?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <div className="filters">
        <label>
          Durum:
          <select name="durum" value={filters.durum} onChange={handleFilterChange}>
            <option value="">Tümü</option>
            <option value="Acil">Acil</option>
            <option value="Beklemede">Beklemede</option>
            <option value="Çözüldü">Çözüldü</option>
          </select>
        </label>
        <label>
          Şirket:
          <select name="sirket" value={filters.sirket} onChange={handleFilterChange}>
            <option value="">Tümü</option>
            {talepler.map(talep => (
              <option key={talep.SirketID} value={talep.SirketAdi}>
                {talep.SirketAdi}
              </option>
            ))}
          </select>
        </label>
        <label>
          Personel:
          <select name="personel" value={filters.personel} onChange={handleFilterChange}>
            <option value="">Tümü</option>
            {personeller.map(personel => (
              <option key={personel.PersonelID} value={`${personel.PersonelAdi} ${personel.PersonelSoyadi}`}>
                {personel.PersonelAdi} {personel.PersonelSoyadi}
              </option>
            ))}
          </select>
        </label>
        <label>
          Arama:
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Talep adı ile ara"
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Talep</th>
            <th>Açıklama</th>
            <th>Durum</th>
            <th>Şirket</th>
            <th>Personel</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredTalepler.map((talep, index) => (
            <React.Fragment key={talep.TalepID}>
              <tr>
                <td className={getDurumClass(talep.Durum)}>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="TalepBasligi"
                      value={editedTalep.TalepBasligi}
                      onChange={handleInputChange}
                    />
                  ) : (
                    talep.TalepBasligi
                  )}
                </td>
                <td className={getDurumClass(talep.Durum)}>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="TalepAciklamasi"
                      value={editedTalep.TalepAciklamasi}
                      onChange={handleInputChange}
                    />
                  ) : (
                    talep.TalepAciklamasi
                  )}
                </td>
                <td className={getDurumClass(talep.Durum)}>
                  {editingIndex === index ? (
                    <select
                      name="Durum"
                      value={editedTalep.Durum}
                      onChange={handleInputChange}
                    >
                      <option value="Beklemede">Beklemede</option>
                      <option value="Çözüldü">Çözüldü</option>
                      <option value="Acil">Acil</option>
                    </select>
                  ) : (
                    talep.Durum
                  )}
                </td>
                <td className={getDurumClass(talep.Durum)}>
                  <Link to={`/Musteriler/${talep.SirketID}`}>{talep.SirketAdi}</Link>
                </td>
                <td className={getDurumClass(talep.Durum)}>
                  {editingIndex === index ? (
                    <select
                      name="PersonelID"
                      value={editedTalep.PersonelID}
                      onChange={handleInputChange}
                    >
                      {personeller.map(personel => (
                        <option key={personel.PersonelID} value={personel.PersonelID}>
                          {personel.PersonelAdi} {personel.PersonelSoyadi}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Link to={`/Personeller/${talep.PersonelID}`}>
                      {talep.PersonelAdi} {talep.PersonelSoyadi}
                    </Link>
                  )}
                </td>
                <td className={getDurumClass(talep.Durum)}>
                  {editingIndex === index ? (
                      <button className="save-button" onClick={() => handleSaveClick(index)}>Kaydet</button>
                  ) : (
                    <>
                      <button className="edit-button" onClick={() => handleEditClick(index, talep)}>Düzenle</button>
                      <button className="delete-button" onClick={() => handleDeleteClick(talep.TalepID)}>Sil</button>
                    </>
                  )}
                </td>
              </tr>
              {talep.showDetails && (
                <tr>
                  <td colSpan="6">
                    <p>Detaylar: {talep.TalepAciklamasi}</p>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaleplerList;
