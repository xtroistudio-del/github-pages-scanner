document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const endpoint = params.get('endpoint');
  const token = params.get('token');
  const kelas = params.get('kelas');
  const guru = params.get('guru');

  if (!endpoint || !token || !kelas || !guru) {
    // Tampilkan pesan di body alih-alih alert
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#fff;flex-direction:column;padding:20px;text-align:center;font-family:sans-serif;">
        <h2>Scanner tidak dapat diakses langsung</h2>
        <p>Silakan gunakan tombol <strong>Scan QR</strong> dari aplikasi absensi.</p>
        <button onclick="window.close()" style="margin-top:20px;padding:10px 20px;border-radius:8px;border:1px solid #ccc;background:#f0f0f0;cursor:pointer;">Tutup</button>
      </div>
    `;
    return;
  }

  // ... sisa kode scanner seperti sebelumnya ...
