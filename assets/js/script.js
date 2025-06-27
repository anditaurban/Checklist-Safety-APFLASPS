let safetyData = { apar: [], forklift: [], eyeshower: [], pintu: [] };

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxde20REwoxAOPkG7jV2FcZ743E1k2TH0z0QMbGPRRkLmmob2QLmjNRhTETxSYRbz7c/exec";

function showTab(tabName, evt) {
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  evt.currentTarget.classList.add('active');

  let file = '';
  if (tabName === 'apar') file = 'form-apar.html';
  else if (tabName === 'forklift') file = 'form-forklift.html';
  else if (tabName === 'eyeshower') file = 'form-eye-shower.html';
  else if (tabName === 'pintu') file = 'form-pintu-geser.html';

  loadForm(file, tabName);
}

function loadForm(fileName, tabName) {
  fetch('section/' + fileName)
    .then(r => {
      if (!r.ok) throw Error(r.status);
      return r.text();
    })
    .then(html => {
      const cont = document.getElementById('formContainer');
      cont.innerHTML = html;

      // pasang listener submit
      let formId = `${tabName}Form`;
      let form = document.getElementById(formId);
      if (form) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          window['save' + capitalize(tabName) + 'Data']();
        });
      }

      // set tanggal hari ini
      const inp = document.getElementById(`${tabName}-tanggal`);
      if (inp) inp.value = new Date().toISOString().split('T')[0];

      // aktifkan section
      document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
      const cursec = document.getElementById(`${tabName}-section`);
      if (cursec) cursec.classList.add('active');

      updateDataCount();
    })
    .catch(err => {
      console.error('fetch fail:', err);
    });
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// Form handler functions
function saveAparData() {
  const data = {
    type: "APAR",
    "Tanggal": getValue('apar-tanggal'),
    "Share ID": getValue('apar-shareId'),
    "Inspektor": getValue('apar-inspektor'),
    "Area": getValue('apar-area'),
    "Nomor APAR": getValue('apar-nomor'),
    "Jenis Isi": getValue('apar-jenisIsi'),
    "Masa Berlaku": getRadioValue("apar-masaBerlaku"),
    "Kondisi Fisik": getRadioValue("apar-kondisiFisik"),
    "Kondisi Kawat Segel": getRadioValue("apar-kawatSegel"),
    "Tekanan Gas": getRadioValue("apar-tekananGas"),
    "Kondisi Nozzle": getRadioValue("apar-nozzle"),
    "Posisi APAR": getRadioValue("apar-posisi"),
    "Kondisi Isi": getRadioValue("apar-kondisiIsi"),
    "Keterangan": getValue('apar-keterangan')
  };
  sendToSheet(data, 'aparForm');
}

function saveForkliftData() {
  const data = {
    type: "FORKLIFT",
    "Tanggal": getValue('forklift-tanggal'),
    "Share ID": getValue('forklift-shareId'),
    "Inspektor": getValue('forklift-inspektor'),
    "Area": getValue('forklift-area'),
    "Shift": getValue('forklift-shift'),
    "Nomor Forklift": getValue('forklift-nomor'),
    "Kondisi Rem/Kopling": getRadioValue("forklift-rem"),
    "Fungsi Setir/Kemudi": getRadioValue("forklift-fork"),
    "Sistem Oli Hidrolik": getRadioValue("forklift-oli"),
    "Fungsi Setir/Kemudi": getRadioValue("forklift-setir"),
    "Fungsi Klakson": getRadioValue("forklift-klakson"),
    "Kondisi Koneksi Battery": getRadioValue("forklift-battery"),
    "Kondisi Ban (Depan/Belakang)": getRadioValue("forklift-ban"),
    "Keterangan": getValue('forklift-keterangan')
  };
  sendToSheet(data, 'forkliftForm');
}

function saveEyeshowerData() {
  const data = {
    type: "EYE_SHOWER",
    "Tanggal": getValue('eyeshower-tanggal'),
    "Share ID": getValue('eyeshower-shareId'),
    "Inspektor": getValue('eyeshower-inspektor'),
    "Area": getValue('eyeshower-area'),
    "Nomor Unit": getValue('eyeshower-nomor'),
    "Kondisi Rambu": getRadioValue("eyeshower-rambu"),
    "Kondisi Penerangan": getRadioValue("eyeshower-penerangan"),
    "Akses dan Pancaran Air": getRadioValue("eyeshower-akses"),
    "Diameter Pancaran Air": getRadioValue("eyeshower-diameter"),
    "Kondisi Pancuran Air": getRadioValue("eyeshower-pancuran"),
    "Kondisi Semua Bagian": getRadioValue("eyeshower-bagian"),
    "Kondisi Valve Incoming": getRadioValue("eyeshower-valve"),
    "Kondisi Pipa": getRadioValue("eyeshower-pipa"),
    "Kelengkapan Part Eyewashes": getRadioValue("eyeshower-parts"),
    "Keterangan": getValue('eyeshower-keterangan')
  };
  sendToSheet(data, 'eyeshowerForm');
}

function savePintuData() {
  const data = {
    type: "PINTU_GESER",
    "Tanggal": getValue('pintu-tanggal'),
    "Share ID": getValue('pintu-shareId'),
    "Inspektor": getValue('pintu-inspektor'),
    "Area": getValue('pintu-area'),
    "Nomor Unit": getValue('pintu-nomor'),
    "Kondisi Pagar": getRadioValue("pintu-pagar"),
    "Kondisi Roda": getRadioValue("pintu-roda"),
    "Jalur Rel Roda": getRadioValue("pintu-rel"),
    "Roller Pintu": getRadioValue("pintu-roller"),
    "Pelumasan Roda": getRadioValue("pintu-pelumasan"),
    "Grendel Pintu": getRadioValue("pintu-grendel"),
    "Stopper Pintu": getRadioValue("pintu-stopper"),
    "Keterangan": getValue('pintu-keterangan')
  };
  sendToSheet(data, 'pintuForm');
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : '';
}

function setCurrentDate() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0'); // bulan 0-indexed
  const dd = String(now.getDate()).padStart(2, '0');

  const today = `${yyyy}-${mm}-${dd}`; // <- format YANG VALID untuk input[type="date"]

  ['apar', 'forklift', 'eyeshower', 'pintu'].forEach(id => {
    const el = document.getElementById(`${id}-tanggal`);
    if (el) el.value = today;
  });
}

function showSuccessMessage() {
  const m = document.getElementById('successMessage');
  if (m) {
    m.style.display = 'block';
    setTimeout(() => m.style.display = 'none', 3000);
  }
}

function updateCountFromGAS(data) {
  const total =
    (data.APAR || 0) +
    (data.FORKLIFT || 0) +
    (data.EYE_SHOWER || 0) +
    (data.PINTU_GESER || 0);

  document.getElementById('dataCount').textContent =
    `📊 Total data tersimpan: ${total} entries
    (APAR: ${data.APAR}, FORKLIFT: ${data.FORKLIFT},
    EYE SHOWER: ${data.EYE_SHOWER}, PINTU GESER: ${data.PINTU_GESER})`;
    console.log("Data dari Apps Script:", data);
}

function updateDataCount() {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://script.google.com/macros/s/AKfycbxde20REwoxAOPkG7jV2FcZ743E1k2TH0z0QMbGPRRkLmmob2QLmjNRhTETxSYRbz7c/exec';
  iframe.style.display = 'none';
  iframe.onload = () => console.log("iframe loaded");
  document.body.appendChild(iframe);
  console.log("Memuat iframe GAS...");
}

updateDataCount();

function refreshPage() { window.location.reload(); }

function sendToSheet(data, formId) {
  const form = document.getElementById(formId);
  const formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  // Tampilkan loading alert
  Swal.fire({
    title: 'Mengirim data...',
    text: 'Mohon tunggu sebentar.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch(SCRIPT_URL, {
    method: "POST",
    body: formData,
    mode: "no-cors"
  }).then(() => {
    // Tutup loading dan tampilkan sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data berhasil dikirim.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    form.reset();
    setCurrentDate();
    updateDataCount();

  }).catch(err => {
    // Tampilkan alert error
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Gagal mengirim data: ' + err.message,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Tutup'
    });

    console.error("Error sending to sheet:", err);
  });
}

// Inisialisasi saat halaman pertama kali dimuat
window.addEventListener('DOMContentLoaded', () => {
  showTab('apar', { currentTarget: document.querySelector('.nav-tab') });
});