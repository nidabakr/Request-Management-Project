import React, { useState, useEffect, useCallback } from 'react';
import ConfirmModal from './ConfirmModal';
import './SirketYonetimi.css';

const SirketYonetimi = () => {
  const [sirketler, setSirketler] = useState([]);
  const [filteredSirketler, setFilteredSirketler] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedSirket, setEditedSirket] = useState({});
  const [notification, setNotification] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    search: ''
  });

  useEffect(() => {
    fetch('http://10.34.4.71:5001/api/Musteriler')
      .then(response => response.json())
      .then(data => {
        setSirketler(data);
        setFilteredSirketler(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filterSirketler = useCallback(() => {
    const filtered = sirketler.filter(sirket => {
      return (
        (filters.search === '' || sirket.SirketAdi.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
    setFilteredSirketler(filtered);
  }, [sirketler, filters]);

  useEffect(() => {
    filterSirketler();
  }, [filters, filterSirketler]);

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
      const response = await fetch(`http://10.34.4.71:5001/api/Musteriler/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız oldu.');
      }

      setSirketler(prevSirketler => prevSirketler.filter(sirket => sirket.SirketID !== deleteId));
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

  const handleEditClick = (index, sirket) => {
    setEditingIndex(index);
    setEditedSirket(sirket);
  };

  const handleSaveClick = async (index) => {
    try {
      const response = await fetch(`http://10.34.4.71:5001/api/Musteriler/${editedSirket.SirketID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSirket),
      });

      if (!response.ok) {
        throw new Error('Güncelleme başarısız oldu.');
      }

      const updatedSirketler = [...sirketler];
      updatedSirketler[index] = editedSirket;
      setSirketler(updatedSirketler);
      setEditingIndex(null);
    } catch (error) {
      console.error('Veri güncellenirken hata oluştu:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSirket(prevSirket => ({
      ...prevSirket,
      [name]: value
    }));
  };

  return (
    <div className="sirket-yonetimi">
      <h1>MÜŞTERİ YÖNETİMİ</h1>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Bu şirketi silmek istediğinize emin misiniz?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <div className="filters">
        <label>
          Arama:
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Şirket adı ile ara"
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Şirket Adı</th>
            <th>E-posta</th>
            <th>Ülke</th>
            <th>Şehir</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredSirketler.map((sirket, index) => (
            <React.Fragment key={sirket.SirketID}>
              <tr>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="SirketAdi"
                      value={editedSirket.SirketAdi}
                      onChange={handleInputChange}
                    />
                  ) : (
                    sirket.SirketAdi
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="Eposta"
                      value={editedSirket.Eposta}
                      onChange={handleInputChange}
                    />
                  ) : (
                    sirket.Eposta
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="Ulke"
                      value={editedSirket.Ulke}
                      onChange={handleInputChange}
                    />
                  ) : (
                    sirket.Ulke
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="Sehir"
                      value={editedSirket.Sehir}
                      onChange={handleInputChange}
                    />
                  ) : (
                    sirket.Sehir
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <button className="save-button" onClick={() => handleSaveClick(index)}>Kaydet</button>
                  ) : (
                    <>
                      <button className="edit-button" onClick={() => handleEditClick(index, sirket)}>Düzenle</button>
                      <button className="delete-button" onClick={() => handleDeleteClick(sirket.SirketID)}>Sil</button>
                    </>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SirketYonetimi;
