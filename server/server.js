const sql = require('mssql/msnodesqlv8');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5001;

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const config = {
    server: 'TPSNBK05\\MSSQLSERVER02',
    database: 'TeknopalasIsler',
    driver: 'msnodesqlv8',
    options: {
        trustServerCertificate: true,
        trustedConnection: true
    },
};

let pool;

sql.connect(config).then(connectedPool => {
    pool = connectedPool;
    if (pool.connected) {
        console.log('MSSQL\'e bağlandı');
    }
    
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });

}).catch(err => {
    console.error('Database connection failed:', err);
});

// Personel Ekleme 
app.post('/api/personel', async (req, res) => {
    const { PersonelAdi, PersonelSoyadi, Departman } = req.body;
    try {
       const result = await pool.request()
       .input('PersonelAdi', sql.VarChar, PersonelAdi)
       .input('PersonelSoyadi', sql.VarChar, PersonelSoyadi)
       .input('Departman', sql.VarChar, Departman)
       .query`INSERT INTO Personel (PersonelAdi, PersonelSoyadi, Departman) VALUES (${PersonelAdi}, ${PersonelSoyadi}, ${Departman})`;
       res.status(201).json({ message: 'Personel başarıyla eklendi.' });
    } catch (err) {
        res.status(500).json({ error: 'Veri ekleme hatası: ' + err.message });
    }
});

// Şirket ekleme
app.post('/api/Musteriler', async (req, res) => {
    const { SirketAdi, Eposta, Ulke, Sehir } = req.body;
    try {
       const pool = await sql.connect(config);
       const result = await pool.request()
       .input('SirketAdi', sql.VarChar, SirketAdi)
       .input('Eposta', sql.VarChar, Eposta)
       .input('Ulke', sql.VarChar, Ulke)
       .input('Sehir', sql.VarChar, Sehir)
       .query('INSERT INTO Musteriler (SirketAdi, Eposta, Ulke, Sehir) VALUES (@SirketAdi, @Eposta, @Ulke, @Sehir)');
       res.status(201).json({ message: 'Şirket başarıyla eklendi.' });
    } catch (err) {
        res.status(500).json({ error: 'Veri ekleme hatası: ' + err.message });
    }
});

app.get('/api/personeller', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT PersonelID, PersonelAdi, PersonelSoyadi, Departman FROM dbo.Personel');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching personel:', error);
      res.status(500).send('Server error');
    }
  });

  app.get('/api/Musteriler', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT SirketID, SirketAdi, Eposta, Ulke, Sehir FROM dbo.Musteriler');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching personel:', error);
      res.status(500).send('Server error');
    }
  });  

// Talepleri güncellemek için API endpoint
app.put('/api/talepler/:TalepID', async (req, res) => {
    const { TalepID } = req.params; // URL'den TalepID'yi al
    const { TalepBasligi, TalepAciklamasi, Durum, Notlar, PersonelID, SirketID } = req.body;

    try {
        const result = await pool.request()
            .input('TalepID', TalepID)
            .input('TalepBasligi', TalepBasligi)
            .input('TalepAciklamasi', TalepAciklamasi)
            .input('Durum', Durum)
            .input('Notlar', Notlar)
            .input('PersonelID', PersonelID)
            .input('SirketID', SirketID)
            .query(`
                UPDATE Talepler
                SET 
                    TalepBasligi = @TalepBasligi,
                    TalepAciklamasi = @TalepAciklamasi,
                    Durum = @Durum,
                    Notlar = @Notlar,
                    PersonelID = @PersonelID,
                    SirketID = @SirketID
                WHERE TalepID = @TalepID
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Talep başarıyla güncellendi.' });
        } else {
            res.status(404).json({ message: 'Talep bulunamadı.' });
        }
    } catch (err) {
        console.error('Veri güncellenirken hata oluştu:', err);
        res.status(500).send('Sunucu Hatası');
    }
});


// Talepler verilerini almak için API endpoint
app.get('/api/talepler', async (req, res) => {
    try {
        const result = await pool.request()
            .query(`
                SELECT t.TalepID, t.TalepBasligi, t.TalepAciklamasi, t.Durum, t.Notlar, 
                    p.PersonelID, p.PersonelAdi, p.PersonelSoyadi, 
                    m.SirketID, m.SirketAdi
                FROM Talepler t
                LEFT JOIN Personel p ON t.PersonelID = p.PersonelID
                LEFT JOIN Musteriler m ON t.SirketID = m.SirketID
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Talepleri silmek için API endpoint
app.delete('/api/talepler/:TalepID', async (req, res) => {
    const { TalepID } = req.params;

    try {
        const result = await pool.request()
            .input('TalepID', sql.Int, TalepID)
            .query('DELETE FROM Talepler WHERE TalepID = @TalepID');

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Talep başarıyla silindi.' });
        } else {
            res.status(404).json({ message: 'Talep bulunamadı.' });
        }
    } catch (err) {
        console.error('Veri silinirken hata oluştu:', err);
        res.status(500).send('Sunucu Hatası');
    }
});

// Taleplerin durumunu güncellemek için API endpoint
app.put('/api/talepler/:id/durum', async (req, res) => {
    const { id } = req.params;
    const { durum } = req.body;

    try {
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('durum', sql.VarChar, durum)
            .query('UPDATE Talepler SET Durum = @durum WHERE TalepID = @id');

        if (result.rowsAffected[0] > 0) {
            res.sendStatus(200);
        } else {
            res.status(404).send('Talep bulunamadı');
        }
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/Musteriler', (req, res) => {
    const { ad } = req.query;
    const sql = 'SELECT SirketID FROM Musteriler WHERE SirketAdi = ?';
    
    db.query(sql, [ad], (err, results) => {
      if (err) {
        console.error('Şirket alınırken hata oluştu:', err);
        res.status(500).send('Veri alınamadı.');
      } else if (results.length === 0) {
        res.status(404).send('Şirket bulunamadı.');
      } else {
        res.json(results[0]);
      }
    });
  });

  app.put('/api/talepler/:id', async (req, res) => {
    const { id } = req.params;
    const { Notlar } = req.body;
  
    try {
      await sql.connect(config);
      const result = await sql.query`UPDATE Talepler SET Notlar = ${Notlar} WHERE TalepID = ${id}`;
      
      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: 'Güncelleme başarılı' });
      } else {
        res.status(404).json({ message: 'Talep bulunamadı' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
  });
  
app.post('/api/talepler', async (req, res) => {
    const { TalepBasligi, TalepAciklamasi, Durum, SirketID, PersonelID, Notlar } = req.body;

    try {
        const result = await pool.request()
            .input('TalepBasligi', sql.VarChar, TalepBasligi)
            .input('TalepAciklamasi', sql.VarChar, TalepAciklamasi)
            .input('Durum', sql.VarChar, Durum)
            .input('SirketID', sql.Int, SirketID)
            .input('PersonelID', sql.Int, PersonelID)
            .input('Notlar', sql.VarChar, Notlar)
            .query(`
                INSERT INTO Talepler (TalepBasligi, TalepAciklamasi, Durum, SirketID, PersonelID, Notlar)
                VALUES (@TalepBasligi, @TalepAciklamasi, @Durum, @SirketID, @PersonelID, @Notlar)

                SELECT SCOPE_IDENTITY() AS TalepID;
            `);
        const newTalepID = result.recordset[0].TalepID;
        
        res.status(201).json({
            message: 'Talep başarıyla eklendi.',
            TalepID: newTalepID,
            TalepBasligi,
            TalepAciklamasi,
            Durum,
            SirketID,
            PersonelID,
            Notlar
        });
    } catch (err) {
        console.error('Veri eklenirken hata oluştu:', err);
        res.status(500).send('Veri eklenemedi.');
    }
});

// Şirket detaylarını almak için API endpoint
app.get('/api/Musteriler/:SirketID', async (req, res) => {
    const { SirketID } = req.params;
    try {
        const result = await pool.request()
            .input('SirketID', sql.Int, SirketID)
            .query(`
                SELECT SirketAdi, Eposta, Ulke, Sehir
                FROM Musteriler
                WHERE SirketID = @SirketID
            `);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Şirket bulunamadı');
        }
    } catch (err) {
        console.error('Error fetching company data:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Personel Detaylarını almak için
app.get('/api/Personeller/:PersonelID', async (req, res) => {
    const { PersonelID } = req.params;
    try {
        const result = await pool.request()
            .input('PersonelID', sql.Int, PersonelID)
            .query(`
                SELECT PersonelAdi, PersonelSoyadi, Departman
                FROM Personel
                WHERE PersonelID = @PersonelID
            `);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Personel bulunamadı');
        }
    } catch (err) {
        console.error('Error fetching company data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/talepler/filter', async (req, res) => {
    const { durum, sirket, personel } = req.query;
    try {
        let query = 'SELECT t.TalepID, t.TalepBasligi, t.TalepAciklamasi, t.Durum, t.Notlar, p.PersonelID, p.PersonelAdi, p.PersonelSoyadi, m.SirketID, m.SirketAdi FROM Talepler t LEFT JOIN Personel p ON t.PersonelID = p.PersonelID LEFT JOIN Musteriler m ON t.SirketID = m.SirketID WHERE 1=1';
        const params = [];

        if (durum) {
            query += ' AND t.Durum = @durum';
            params.push({ name: 'durum', type: sql.VarChar, value: durum });
        }

        if (sirket) {
            query += ' AND m.SirketID = @sirket';
            params.push({ name: 'sirket', type: sql.Int, value: parseInt(sirket) });
        }

        if (personel) {
            query += ' AND p.PersonelID = @personel';
            params.push({ name: 'personel', type: sql.Int, value: parseInt(personel) });
        }

        const result = await pool.request()
            .query(query, params);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error filtering talepler:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Şirket Güncelleme
app.put('/api/musteriler/:SirketID', async (req, res) => {
    const { SirketID } = req.params;
    const { SirketAdi, Eposta, Ulke, Sehir } = req.body;
    try {
        await pool.request()
            .input('SirketID', sql.Int, SirketID)
            .input('SirketAdi', sql.VarChar, SirketAdi)
            .input('Eposta', sql.VarChar, Eposta)
            .input('Ulke', sql.VarChar, Ulke)
            .input('Sehir', sql.VarChar, Sehir)
            .query(`
                UPDATE Musteriler
                SET SirketAdi = @SirketAdi,
                    Eposta = @Eposta,
                    Ulke = @Ulke,
                    Sehir = @Sehir
                WHERE SirketID = @SirketID
            `);
        res.status(200).json({ message: 'Şirket başarıyla güncellendi.' });
    } catch (err) {
        console.error('Error updating company:', err);
        res.status(500).json({ error: 'Şirket güncellenirken bir hata oluştu: ' + err.message });
    }
});

// Personel Güncelleme
app.put('/api/personel/:PersonelID', async (req, res) => {
    const { PersonelID } = req.params;
    const { PersonelAdi, PersonelSoyadi, Departman } = req.body;
    try {
        await pool.request()
            .input('PersonelID', sql.Int, PersonelID)
            .input('PersonelAdi', sql.VarChar, PersonelAdi)
            .input('PersonelSoyadi', sql.VarChar, PersonelSoyadi)
            .input('Departman', sql.VarChar, Departman)
            .query(`
                UPDATE Personel
                SET PersonelAdi = @PersonelAdi,
                    PersonelSoyadi = @PersonelSoyadi,
                    Departman = @Departman
                WHERE PersonelID = @PersonelID
            `);
        res.status(200).json({ message: 'Personel başarıyla güncellendi.' });
    } catch (err) {
        console.error('Error updating personel:', err);
        res.status(500).json({ error: 'Personel güncellenirken bir hata oluştu: ' + err.message });
    }
});

// Şirket Silme
app.delete('/api/musteriler/:SirketID', async (req, res) => {
    const { SirketID } = req.params;
    try {
        await pool.request()
            .input('SirketID', sql.Int, SirketID)
            .query('DELETE FROM Musteriler WHERE SirketID = @SirketID');
        res.status(200).json({ message: 'Şirket başarıyla silindi.' });
    } catch (err) {
        console.error('Error deleting company:', err);
        res.status(500).json({ error: 'Şirket silinirken bir hata oluştu: ' + err.message });
    }
});

// Personel Silme
app.delete('/api/personel/:PersonelID', async (req, res) => {
    const { PersonelID } = req.params;
    try {
        await pool.request()
            .input('PersonelID', sql.Int, PersonelID)
            .query('DELETE FROM Personel WHERE PersonelID = @PersonelID');
        res.status(200).json({ message: 'Personel başarıyla silindi.' });
    } catch (err) {
        console.error('Error deleting personel:', err);
        res.status(500).json({ error: 'Personel silinirken bir hata oluştu: ' + err.message });
    }
});

// Talep durumları sayısını almak için API endpoint
app.get('/api/talepler', async (req, res) => {
    try {
        if (!pool) {
            await sql.connect(config);
        }
        const result = await pool.request()
            .query(`
                SELECT 
                    SUM(CASE WHEN Durum = 'Beklemede' THEN 1 ELSE 0 END) AS Beklemede,
                    SUM(CASE WHEN Durum = 'Acil' THEN 1 ELSE 0 END) AS Acil,
                    SUM(CASE WHEN Durum = 'Çözüldü' THEN 1 ELSE 0 END) AS Çözüldü,
                    COUNT(*) AS ToplamTalep
                FROM Talepler
            `);
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Talep durumları alınırken hata oluştu:', err);
        res.status(500).send('Sunucu Hatası');
    }
});
