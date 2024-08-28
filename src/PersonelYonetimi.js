import React, { useState, useEffect, useCallback } from 'react';
import ConfirmModal from './ConfirmModal';
import './PersonelYonetimi.css';

const PersonelYonetimi = () => {
  const [personeller, setPersoneller] = useState([]);
  const [filteredPersoneller, setFilteredPersoneller] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPersonel, setEditedPersonel] = useState({});
  const [notification, setNotification] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({
    search: ''
  });

  useEffect(() => {
    fetch('http://10.34.4.71:5001/api/personeller')
      .then(response => response.json())
      .then(data => {
        setPersoneller(data);
        setFilteredPersoneller(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filterPersoneller = useCallback(() => {
    const filtered = personeller.filter(personel => {
      return (
        (filters.search === '' || `${personel.PersonelAdi} ${personel.PersonelSoyadi}`.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
    setFilteredPersoneller(filtered);
  }, [personeller, filters]);

  useEffect(() => {
    filterPersoneller();
  }, [filters, filterPersoneller]);

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
      const response = await fetch(`http://10.34.4.71:5001/api/personel/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız oldu.');
      }

      setPersoneller(prevPersoneller => prevPersoneller.filter(personel => personel.PersonelID !== deleteId));
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

  const handleEditClick = (index, personel) => {
    setEditingIndex(index);
    setEditedPersonel(personel);
  };

  const handleSaveClick = async (index) => {
    try {
      const response = await fetch(`http://10.34.4.71:5001/api/Personel/${editedPersonel.PersonelID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPersonel),
      });

      if (!response.ok) {
        throw new Error('Güncelleme başarısız oldu.');
      }

      const updatedPersoneller = [...personeller];
      updatedPersoneller[index] = editedPersonel;
      setPersoneller(updatedPersoneller);
      setEditingIndex(null);
      setNotification('Güncelleme başarılı.');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Veri güncellenirken hata oluştu:', error);
      setNotification('Güncelleme işlemi başarısız oldu.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPersonel(prevPersonel => ({
      ...prevPersonel,
      [name]: value
    }));
  };

  return (
    <div className="personel-yonetimi">
      <h1>PERSONEL YÖNETİMİ</h1>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      {showConfirmModal && (
        <ConfirmModal
          message="Bu personeli silmek istediğinize emin misiniz?"
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
            placeholder="Personel adı ile ara"
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Personel Adı</th>
            <th>Personel Soyadı</th>
            <th>Departman</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersoneller.map((personel, index) => (
            <React.Fragment key={personel.PersonelID}>
              <tr>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="PersonelAdi"
                      value={editedPersonel.PersonelAdi}
                      onChange={handleInputChange}
                    />
                  ) : (
                    personel.PersonelAdi
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="PersonelSoyadi"
                      value={editedPersonel.PersonelSoyadi}
                      onChange={handleInputChange}
                    />
                  ) : (
                    personel.PersonelSoyadi
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="Departman"
                      value={editedPersonel.Departman}
                      onChange={handleInputChange}
                    />
                  ) : (
                    personel.Departman
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <button className="save-button" onClick={() => handleSaveClick(index)}>Kaydet</button>
                  ) : (
                    <>
                      <button className="edit-button" onClick={() => handleEditClick(index, personel)}>Düzenle</button>
                      <button className="delete-button" onClick={() => handleDeleteClick(personel.PersonelID)}>Sil</button>
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

export default PersonelYonetimi;
