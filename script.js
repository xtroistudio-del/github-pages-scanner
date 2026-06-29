document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const endpoint = params.get('endpoint');
  const token = params.get('token');
  const kelas = params.get('kelas');
  const guru = params.get('guru');

  if (!endpoint || !token || !kelas || !guru) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#fff;flex-direction:column;padding:20px;text-align:center;font-family:'Poppins',sans-serif;">
        <h2>Scanner tidak dapat diakses langsung</h2>
        <p>Silakan gunakan tombol <strong>Scan QR</strong> dari aplikasi absensi.</p>
        <button onclick="window.close()" style="margin-top:20px;padding:10px 20px;border-radius:8px;border:1px solid #ccc;background:#f0f0f0;cursor:pointer;">Tutup</button>
        ${!window.close ? '<p style="color:red;">Jika tombol tidak berfungsi, tutup tab secara manual.</p>' : ''}
      </div>
    `;
    return;
  }

  const readerDiv = document.getElementById('reader');
  const statusDiv = document.getElementById('status');
  const closeBtn = document.getElementById('closeBtn');
  let scanner;

  closeBtn.onclick = () => window.close();

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      gain.gain.value = 0.1;
      oscillator.start();
      setTimeout(() => { oscillator.stop(); ctx.close(); }, 200);
    } catch (e) { /* tidak ada audio */ }
  }

  function vibrate() {
    if (navigator.vibrate) navigator.vibrate(200);
  }

  async function sendAbsensi(nis) {
    statusDiv.textContent = 'Mengirim data...';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scanAbsensi', data: { token, nis, kelas, guru } })
      });
      const json = await res.json();
      if (json.success) {
        const anim = document.createElement('div');
        anim.className = 'success-animation';
        anim.innerHTML = '✅';
        document.body.appendChild(anim);
        beep();
        vibrate();
        statusDiv.textContent = json.message;
        setTimeout(() => {
          window.close();
        }, 1500);
      } else {
        statusDiv.textContent = 'Error: ' + json.message;
        setTimeout(() => {
          statusDiv.textContent = 'Arahkan kamera ke QR Code';
        }, 3000);
      }
    } catch (err) {
      statusDiv.textContent = 'Jaringan error';
      setTimeout(() => {
        statusDiv.textContent = 'Arahkan kamera ke QR Code';
      }, 3000);
    }
  }

  function onScanSuccess(decodedText) {
    scanner.stop();
    const nis = decodedText.trim();
    sendAbsensi(nis);
  }

  scanner = new Html5Qrcode('reader');
  try {
    await scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess,
      undefined
    );
    statusDiv.textContent = 'Arahkan kamera ke QR Code';
  } catch (err) {
    statusDiv.textContent = 'Gagal mengakses kamera: ' + err;
  }
});
