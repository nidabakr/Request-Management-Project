import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BeklemedeTalepler.css';

const BeklemedeTalepler = () => {
    const [talepler, setTalepler] = useState([]);

    useEffect(() => {
        fetch('http://10.34.4.71:5001/api/talepler')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(talep => talep.Durum === 'Beklemede' || talep.Durum === 'Acil');
                const sortedData = filteredData.sort((a, b) => {
                    if (a.Durum === 'Acil' && b.Durum !== 'Acil') return -1;
                    if (a.Durum !== 'Acil' && b.Durum === 'Acil') return 1;
                    return 0;
                });
                setTalepler(sortedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleUrgentToggle = (id, currentDurum) => {
        const newDurum = currentDurum === 'Acil' ? 'Beklemede' : 'Acil';

        fetch(`http://10.34.4.71:5001/api/talepler/${id}/durum`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ durum: newDurum }),
        })
        .then(response => {
            if (response.ok) {
                setTalepler(prevTalepler => {
                    const updatedTalepler = prevTalepler.map(talep =>
                        talep.TalepID === id ? { ...talep, Durum: newDurum } : talep
                    );

                    const sortedTalepler = updatedTalepler.sort((a, b) => {
                        if (a.Durum === 'Acil' && b.Durum !== 'Acil') return -1;
                        if (a.Durum !== 'Acil' && b.Durum === 'Acil') return 1;
                        return 0;
                    });

                    return sortedTalepler;
                });
            } else {
                console.error('Durum güncellenemedi.');
            }
        })
        .catch(error => console.error('Error updating status:', error));
    };

    const getRowClass = (durum) => {
        if (durum === 'Acil') return 'durum-acil';
        if (durum === 'Beklemede') return 'durum-beklemede';
        return ''; 
    };

    return (
        <div className="beklemede-talepler">
            <h1>Beklemede olan Talepler</h1>
            <table>
                <thead>
                    <tr>
                        <th>Talep Başlığı</th>
                        <th>Açıklama</th>
                        <th>Durum</th>
                        <th>Notlar</th>
                        <th>Şirket</th>
                        <th>Personel</th>
                        <th>Acil</th>
                    </tr>
                </thead>
                <tbody>
                    {talepler.map(talep => (
                        <tr key={talep.TalepID} className={getRowClass(talep.Durum)}>
                            <td>{talep.TalepBasligi}</td>
                            <td>{talep.TalepAciklamasi}</td>
                            <td>{talep.Durum}</td>
                            <td>{talep.Notlar}</td>
                            <td>
                                <Link to={`/Musteriler/${talep.SirketID}`}>{talep.SirketAdi}</Link>
                            </td>
                            <td>{talep.PersonelAdi} {talep.PersonelSoyadi}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={talep.Durum === 'Acil'}
                                    onChange={() => handleUrgentToggle(talep.TalepID, talep.Durum)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BeklemedeTalepler;
