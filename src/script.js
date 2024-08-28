document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('table tbody tr').forEach(row => {
      const durum = row.querySelector('td:nth-child(2)').textContent.trim();
      if (durum === 'Beklemede') {
        row.classList.add('durum-beklemede');
      } else if (durum === 'Çözüldü') {
        row.classList.add('durum-cozuldu');
      } else if (durum === 'Acil') {
        row.classList.add('durum-acil');
      }
    });
  });

export function updateTableColors() {
    const rows = document.querySelectorAll('table tr');
    rows.forEach(row => {
      const status = row.dataset.status;
      if (status === 'acil') {
        row.style.backgroundColor = 'red';
      } else if (status === 'beklemede') {
        row.style.backgroundColor = 'yellow';
      } else if (status === 'çözüldü') {
        row.style.backgroundColor = 'lightgreen';
      }
    });
  }

  
  
  