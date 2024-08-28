import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { updateTableColors } from './script';
import TaleplerList from './TaleplerList';
import CozulduTalepler from './CozulduTalepler';
import BeklemedeTalepler from './BeklemedeTalepler';
import SirketDetaylari from './SirketDetaylari';
import PersonelEkle from './PersonelEkle';
import SirketEkle from './SirketEkle';
import TalepEkle from './TalepEkle';
import PersonelDetaylari from './PersonelDetaylari';
import HomePage from './HomePage'; 
import PersonelYonetimi from './PersonelYonetimi';
import SirketYonetimi from './SirketYonetimi';

function App() {
    useEffect(() => {
        updateTableColors();
    }, []);

    const DropdownButton = () => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        return (
            <div className="dropdown">
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Menü
                </button>
                {isOpen && (
                    <div className="dropdown-content">
                        <a href="/personel-yonetimi">Personel Yönetimi</a>
                        <a href="/sirket-yonetimi">Müşteri Yönetimi</a>
                        <a href="/personel-ekle">Personel Ekle</a>
                        <a href="/sirket-ekle">Şirket Ekle</a>
                        <a href="/talep-ekle">Talep Ekle</a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul className="vertical-menu">
                            <li><Link to="/">Ana Sayfa</Link></li>
                            <li><Link to="/talepler-listesi">Tüm Talepler</Link></li>
                        </ul>
                        <ul className="horizontal-menu">
                            <li><Link to="/cozuldu">Çözülen Talepler</Link></li>
                            <li><Link to="/beklemede">Beklemede Talepler</Link></li>
                        </ul>
                    </nav>
                </header>
                <div className='menu-button'>
                    <DropdownButton /> 
                </div>    
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/talepler-listesi" element={<TaleplerList />} />
                        <Route path="/cozuldu" element={<CozulduTalepler />} />
                        <Route path="/beklemede" element={<BeklemedeTalepler />} />
                        <Route path="/Musteriler/:SirketID" element={<SirketDetaylari />} />
                        <Route path="/Personeller/:PersonelID" element={<PersonelDetaylari />} />
                        <Route path="/personel-ekle" element={<PersonelEkle />} />
                        <Route path="/sirket-ekle" element={<SirketEkle />} />
                        <Route path="/talep-ekle" element={<TalepEkle />} />
                        <Route path="/personel-yonetimi" element={<PersonelYonetimi />} />
                        <Route path="/sirket-yonetimi" element={<SirketYonetimi />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
