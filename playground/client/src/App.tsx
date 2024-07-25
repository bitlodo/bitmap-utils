import './App.css'
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import ImgGithub from './assets/github-mark.svg';
import Home from './pages/Home';
import Topology from './pages/Topology';
import PageSearch from './pages/PageSearch';
import ReactComponents from './pages/ReactComponents';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMenu = (menu: string) => location.pathname === menu ? "menu-item menu-item-selected" : "menu-item";

  return (
    <div className="container" style={{ minHeight: '100vh' }}>

      <div className="sidebar" style={{ minHeight: '100vh' }}>
        <div>
          <h2 style={{ lineHeight: '1em', fontSize: '1.8em' }}>Bitmap Playground</h2>
          <button className={selectedMenu("/")} onClick={() => navigate("/")} >Home</button>
          <button className={selectedMenu("/database")} onClick={() => navigate("/database")} >Database Search</button>
          <button className={selectedMenu("/components")} onClick={() => navigate("/components")} >React Components</button>
          <button className={selectedMenu("/topology")} onClick={() => navigate("/topology")} >Topology</button>

          <div style={{ marginTop: '20px', alignContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={() => window.open('https://github.com/bitlodo/bitmap-utils', '_blank')} style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <img src={ImgGithub} alt="GitHub logo" style={{ width: '20px', height: '20px', marginBottom: '0px' }} /> &nbsp; Github
            </button>

            <span style={{ fontSize: '1em', color: '#888' }}>
              by <a href='https://twitter.com/bitlodo' target='_blank' style={{ color: '#888' }}>@bitlodo</a>
            </span>

          </div>
        </div>
      </div>

      <div className="content">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/database" element={<PageSearch />} />
          <Route path="/components" element={<ReactComponents />} />
          <Route path="/topology" element={<Topology />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>

      </div>
    </div>
  )
}

export default App
