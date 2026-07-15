import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [totalAnak, setTotalAnak] = useState(0);
  const [totalLaki, setTotalLaki] = useState(0);
  const [totalPerempuan, setTotalPerempuan] = useState(0);

  async function hitungData() {
    const { data, error } = await supabase.from('anak_panti').select('jenis_kelamin');
    if (data) {
      setTotalAnak(data.length);
      setTotalLaki(data.filter(a => a.jenis_kelamin === 'Laki-laki').length);
      setTotalPerempuan(data.filter(a => a.jenis_kelamin === 'Perempuan').length);
    }
  }

  useEffect(() => { hitungData(); }, []);

  return (
    <div>
      <h2 style={{ color: '#2c3e50' }}>📊 Dashboard Ringkasan Panti</h2>
      <hr />
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ ...boxStyle, background: '#3498db' }}>
          <h3>Total Anak Asuh</h3>
          <p style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{totalAnak} Anak</p>
        </div>
        <div style={{ ...boxStyle, background: '#2ecc71' }}>
          <h3>👦 Laki-laki</h3>
          <p style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{totalLaki}</p>
        </div>
        <div style={{ ...boxStyle, background: '#e74c3c' }}>
          <h3>👧 Perempuan</h3>
          <p style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>{totalPerempuan}</p>
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  flex: 1,
  padding: '20px',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};