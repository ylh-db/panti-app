import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AnakPanti from './pages/AnakPanti';
import Perkembangan from './pages/Perkembangan';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', fontFamily: 'sans-serif', minHeight: '100vh' }}>
        
        {/* MENU SIDEBAR KIRI (NAVIGASI) */}
        <div style={{ width: '260px', background: '#2c3e50', color: 'white', padding: '25px', boxSizing: 'border-box' }}>
          <h3 style={{ margin: 0, textAlign: 'center', color: '#ecf0f1' }}>🏡 PANTI ASUHAN LENTERA HATI</h3>
          <p style={{ fontSize: '11px', textAlign: 'center', color: '#bdc3c7', marginTop: '5px' }}>Sistem Informasi Anak Asuh</p>
          <hr style={{ borderColor: '#34495e', margin: '20px 0' }} />
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" style={linkStyle}>📊 Dashboard Ringkasan</Link>
            <Link to="/anak" style={linkStyle}>👶 Data Profil Anak</Link>
            <Link to="/perkembangan" style={linkStyle}>📈 Riwayat Tahunan</Link>
          </nav>
        </div>

        {/* AREA ISI HALAMAN KANAN */}
        <div style={{ flex: 1, padding: '40px', background: '#ffffff', boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/anak" element={<AnakPanti />} />
            <Route path="/perkembangan" element={<Perkembangan />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

const linkStyle = {
  color: '#ecf0f1',
  textDecoration: 'none',
  padding: '12px 15px',
  borderRadius: '6px',
  background: '#34495e',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: '0.2s',
  display: 'block'
};