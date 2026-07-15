import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Perkembangan() {
  const [anakList, setAnakList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  
  const [selectedChild, setSelectedChild] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [tinggi, setTinggi] = useState('');
  const [berat, setBerat] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [kelas, setKelas] = useState('');
  const [catatan, setCatatan] = useState('');

  // Ambil daftar anak untuk pilihan dropdown
  async function loadAnak() {
    const { data } = await supabase.from('anak_panti').select('id, nama_lengkap').order('nama_lengkap');
    if (data) setAnakList(data);
  }

  // Ambil riwayat perkembangan saat anak dipilih
  async function loadRiwayat(childId) {
    if (!childId) return setRiwayatList([]);
    const { data } = await supabase.from('perkembangan_anak').select('*').eq('child_id', childId).order('tahun', { ascending: false });
    if (data) setRiwayatList(data);
  }

  useEffect(() => { loadAnak(); }, []);
  useEffect(() => { loadRiwayat(selectedChild); }, [selectedChild]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedChild) return alert("Pilih anak terlebih dahulu!");

    const { error } = await supabase.from('perkembangan_anak').insert([{
      child_id: selectedChild,
      tahun: parseInt(tahun),
      tinggi_badan: parseFloat(tinggi) || null,
      berat_badan: parseFloat(berat) || null,
      jenjang_sekolah: sekolah,
      kelas: kelas,
      prestasi_catatan: catatan
    }]);

    if (error) {
      alert("Gagal menyimpan data perkembangan!");
    } else {
      alert("Riwayat tahunan berhasil disimpan!");
      setTinggi(''); setBerat(''); setSekolah(''); setKelas(''); setCatatan('');
      loadRiwayat(selectedChild);
    }
  }

  return (
    <div>
      <h2 style={{ color: '#2c3e50' }}>📈 Catatan Perkembangan Tahunan Anak</h2>
      <hr />

      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Silakan Pilih Anak Asuh: </label>
        <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} style={{ padding: '10px', width: '300px', marginLeft: '10px', borderRadius: '4px' }}>
          <option value="">-- Pilih Anak --</option>
          {anakList.map(a => <option key={a.id} value={a.id}>{a.nama_lengkap}</option>)}
        </select>
      </div>

      {selectedChild && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* FORM INPUT */}
          <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>➕ Tambah Catatan Tahun {tahun}</h3>
            
            <label>Tahun Catatan</label>
            <input type="number" value={tahun} onChange={(e) => setTahun(e.target.value)} required style={inputStyle} />

            <label>Tinggi Badan (cm)</label>
            <input type="number" value={tinggi} onChange={(e) => setTinggi(e.target.value)} style={inputStyle} />

            <label>Berat Badan (kg)</label>
            <input type="number" value={berat} onChange={(e) => setBerat(e.target.value)} style={inputStyle} />

            <label>Jenjang Sekolah (SD/SMP/SMA/Lainnya)</label>
            <input type="text" value={sekolah} placeholder="Contoh: SD IT Al-Ikhlas" onChange={(e) => setSekolah(e.target.value)} style={inputStyle} />

            <label>Kelas</label>
            <input type="text" value={kelas} placeholder="Contoh: 4 atau 10-A" onChange={(e) => setKelas(e.target.value)} style={inputStyle} />

            <label>Catatan Prestasi / Perkembangan</label>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} style={{ ...inputStyle, height: '60px' }}></textarea>

            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Simpan Riwayat</button>
          </form>

          {/* TABEL SEJARAH */}
          <div>
            <h3>📋 Sejarah Perkembangan dari Tahun ke Tahun</h3>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                  <th>Tahun</th>
                  <th>Fisik (TB/BB)</th>
                  <th>Sekolah & Kelas</th>
                  <th>Catatan / Prestasi</th>
                </tr>
              </thead>
              <tbody>
                {riwayatList.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#95a5a6' }}>Belum ada riwayat tahunan untuk anak ini.</td></tr>
                ) : (
                  riwayatList.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 'bold' }}>{r.tahun}</td>
                      <td>🧍 {r.tinggi_badan || '-'} cm<br />⚖️ {r.berat_badan || '-'} kg</td>
                      <td>🏫 {r.jenjang_sekolah || '-'}<br />🚪 Kelas: {r.kelas || '-'}</td>
                      <td style={{ fontSize: '13px', color: '#555' }}>{r.prestasi_catatan || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };