import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Counter.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Counter = () => {
  const [counts, setCounts] = useState({
    toplamTalep: 0,
    beklemede: 0,
    acil: 0,
    çözüldü: 0
  });

  useEffect(() => {
    fetch('/api/talepler')
      .then(response => response.json())
      .then(data => {
        const beklemede = data.filter(talep => talep.Durum === 'Beklemede').length;
        const acil = data.filter(talep => talep.Durum === 'Acil').length;
        const çözüldü = data.filter(talep => talep.Durum === 'Çözüldü').length;
        const toplamTalep = data.length;

        setCounts({
          toplamTalep,
          beklemede,
          acil,
          çözüldü
        });
      })
      .catch(error => {
        console.error('Veriler alınırken hata oluştu:', error);
      });
  }, []);

  // Yüzdeleri hesaplama
  const total = counts.toplamTalep || 1; 
  const data = {
    labels: ['Beklemede', 'Acil', 'Çözüldü'],
    datasets: [
      {
        label: 'Talep Durumları',
        data: [
          counts.beklemede,
          counts.acil,
          counts.çözüldü
        ],
        backgroundColor: ['#ffff52', '#f15858', '#79ec62'],
        borderWidth: 1
      }
    ]
  };

  // Grafik opsiyonları
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: '#a5s4f',
        font: {
            weight: 'bold',
            size: 14,
          },
        formatter: function (value, context) {
          const percentage = ((value / total) * 100).toFixed(2);
          return `${value} (${percentage}%)`;
        },
        anchor: 'end',
        align: 'top',
        offset: 4,
      }
    }
  };

  return (
    <div className="counter-container">
      <h2>Talep Durumları</h2>
      <Pie data={data} options={options} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <strong>Toplam Talep Sayısı: {counts.toplamTalep}</strong>
      </div>
    </div>
  );
};

export default Counter;
