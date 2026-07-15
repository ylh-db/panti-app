import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function App() {
  const [anakList, setAnakList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk menampung semua kolom input formulir
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    jenis_kelamin: 'Laki-laki',
    nik: '',
    no_kk: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat: '',
    nama_ayah: '',
    nama_ibu: '',
    status: 'Yatim',
    latar_belakang_awal: '',
    tanggal_masuk_panti: ''
  });

  // State kontrol untuk mode edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 1. FUNGSI AMBIL DATA & PENCARIAN (READ)
  async function fetchAnak() {
    let query = supabase.from('anak_panti').select('*');
    
    // Fitur pencarian instan berdasarkan Nama atau NIK (Mirip Neo Feeder)
    if (searchQuery) {
      query = query.or(`nama_lengkap.ilike.%${searchQuery}%,nik.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query.order('nama_lengkap', { ascending: true });
    if (data) setAnakList(data);
  }

  useEffect(() => {
    fetchAnak();
  }, [searchQuery]); // Otomatis refresh tabel saat mengetik di kolom cari

  // 2. FUNGSI HANDLE PERUBAHAN INPUT FORM
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. FUNGSI SIMPAN & PERBARUI DATA (CREATE & UPDATE)
  async function handleSubmit(e) {
    e.preventDefault();

    // Validasi Panjang Karakter (16 Digit)
    if (formData.nik.length !== 16) return alert("NIK harus tepat 16 digit!");
    if (formData.no_kk && formData.no_kk.length !== 16) return alert("Nomor KK harus tepat 16 digit!");

    if (isEditing) {
      // PROSES UPDATE DATA
      const { error } = await supabase
        .from('anak_panti')
        .update(formData)
        .eq('id', editId);

      if (error) {
        alert("Gagal memperbarui data! Periksa apakah NIK sudah digunakan.");
      } else {
        alert("Data anak berhasil diperbarui!");
        resetForm();
        fetchAnak();
      }
    } else {
      // PROSES INSERT DATA BARU
      const { error } = await supabase
        .from('anak_panti')
        .insert([formData]);

      if (error) {
        alert("Gagal menyimpan! NIK tersebut mungkin sudah terdaftar.");
      } else {
        alert("Data anak baru berhasil disimpan!");
        resetForm();
        fetchAnak();
      }
    }
  }

  // 4. FUNGSI TOMBOL EDIT (Isi form dengan data lama)
  function handleEditClick(anak) {
    setIsEditing(true);
    setEditId(anak.id);
    setFormData({
      nama_lengkap: anak.nama_lengkap || '',
      jenis_kelamin: anak.jenis_kelamin || 'Laki-laki',
      nik: anak.nik || '',
      no_kk: anak.no_kk || '',
      tempat_lahir: anak.tempat_lahir || '',
      tanggal_lahir: anak.tanggal_lahir || '',
      alamat: anak.alamat || '',
      nama_ayah: anak.nama_ayah || '',
      nama_ibu: anak.nama_ibu || '',
      status: anak.status || 'Yatim',
      latar_belakang_awal: anak.latar_belakang_awal || '',
      tanggal_masuk_panti: anak.tanggal_masuk_panti || ''
    });
  }

  // 5. FUNGSI HAPUS DATA (DELETE)
  async function handleHapus(id) {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus data anak ini?");
    if (!konfirmasi) return;

    const { error } = await supabase.from('anak_panti').delete().eq('id', id);

    if (error) {
      alert("Gagal menghapus data!");
    } else {
      alert("Data berhasil dihapus!");
      fetchAnak();
    }
  }

  // Fungsi Reset Formulir ke Kosong
  function resetForm() {
    setFormData({
      nama_lengkap: '',
      jenis_kelamin: 'Laki-laki',
      nik: '',
      no_kk: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      alamat: '',
      nama_ayah: '',
      nama_ibu: '',
      status: 'Yatim',
      latar_belakang_awal: '',
      tanggal_masuk_panti: ''
    });
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Sistem Informasi & Data Anak Panti Asuhan</h2>
      <hr />

      {/* FORM ENTRI DATA */}
      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>{isEditing ? "📝 Edit Data Anak" : "➕ Tambah Anak Baru"}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Kolom Kiri */}
          <div>
            <label style={labelStyle}>Nama Lengkap *</label>
            <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required style={inputStyle} />

            <label style={labelStyle}>Jenis Kelamin</label>
            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} style={inputStyle}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>

            <label style={labelStyle}>NIK (Nomor Induk Kependudukan) *</label>
            <input type="number" name="nik" value={formData.nik} onChange={handleInputChange} required style={inputStyle} placeholder="16 Digit" />

            <label style={labelStyle}>Nomor Kartu Keluarga (KK)</label>
            <input type="number" name="no_kk" value={formData.no_kk} onChange={handleInputChange} style={inputStyle} placeholder="16 Digit" />

            <label style={labelStyle}>Tempat Lahir</label>
            <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange} style={inputStyle} />

            <label style={labelStyle}>Tanggal Lahir</label>
            <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleInputChange} style={inputStyle} />
          </div>

          {/* Kolom Kanan */}
          <div>
            <label style={labelStyle}>Nama Ayah Kandung/Tiri</label>
            <input type="text" name="nama_ayah" value={formData.nama_ayah} onChange={handleInputChange} style={inputStyle} />

            <label style={labelStyle}>Nama Ibu Kandung</label>
            <input type="text" name="nama_ibu" value={formData.nama_ibu} onChange={handleInputChange} style={inputStyle} />

            <label style={labelStyle}>Status Anak</label>
            <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
              <option value="Yatim">Yatim</option>
              <option value="Piatu">Piatu</option>
              <option value="Yatim Piatu">Yatim Piatu</option>
              <option value="Dhuafa">Dhuafa</option>
              <option value="Anak Terlantar">Anak Terlantar</option>
            </select>

            <label style={labelStyle}>Tanggal Masuk Panti</label>
            <input type="date" name="tanggal_masuk_panti" value={formData.tanggal_masuk_panti} onChange={handleInputChange} style={inputStyle} />

            <label style={labelStyle}>Alamat Asal / Domisili</label>
            <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} style={{ ...inputStyle, height: '60px' }}></textarea>

            <label style={labelStyle}>Latar Belakang Awal / Catatan Kasus Anak</label>
            <textarea name="latar_belakang_awal" value={formData.latar_belakang_awal} onChange={handleInputChange} style={{ ...inputStyle, height: '60px' }}></textarea>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ padding: '12px 25px', backgroundColor: isEditing ? '#e67e22' : '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isEditing ? "Perbarui Data Anak" : "Simpan Data Anak"}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ marginLeft: '10px', padding: '12px 25px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Batal Edit
            </button>
          )}
        </div>
      </form>

      {/* FILTER PENCARIAN & DAFTAR TABEL */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>📋 Daftar Anak Panti Tercatat</h3>
          <input type="text" placeholder="🔍 Cari nama atau NIK anak..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                <th>Nama Lengkap</th>
                <th>L/P</th>
                <th>NIK</th>
                <th>Status</th>
                <th>Tgl Masuk</th>
                <th>Orang Tua (A/I)</th>
                <th>Catatan Masuk</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {anakList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>Data tidak ditemukan atau masih kosong.</td>
                </tr>
              ) : (
          anakList.map((anak) => (
            <tr key={anak.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ fontWeight: 'bold' }}>{anak.nama_lengkap}</td>
              <td>{anak.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
              <td>{anak.nik}</td>
              <td><span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#e1f5fe', color: '#0288d1', fontWeight: 'bold' }}>{anak.status}</span></td>
              <td>{anak.tanggal_masuk_panti || '-'}</td>
              <td>👨‍💼 {anak.nama_ayah || '-'}<br />👩‍💼 {anak.nama_ibu || '-'}</td>
              <td style={{ maxWidth: '200px', fontSize: '13px', color: '#555', wordBreak: 'break-word' }}>{anak.latar_belakang_awal || '-'}</td>
              <td>
                <button onClick={() => handleEditClick(anak)} style={{ marginRight: '5px', backgroundColor: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleHapus(anak.id)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
</div>
);
}

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  marginTop: '10px',
  color: '#2c3e50',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  marginBottom: '5px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};