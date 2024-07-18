import './App.css'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import ImgGithub from './assets/github-mark.svg';
import Home from './pages/Home';
import Page2DGeneration from './pages/Page2DGeneration'
import Page3DGeneration from './pages/Page3DGeneration';
import Topology from './pages/Topology';
import PageSearch from './pages/PageSearch';

function App() {
  const navigate = useNavigate();
  return (
    <div className="container" style={{ minHeight: '100vh' }}>

      <div className="sidebar" style={{ minHeight: '100vh' }}>
        <div>
          <h2 style={{lineHeight: '1em', fontSize: '1.8em'}}>Bitmap Playground</h2>
          <button className="menu-item" onClick={() => navigate("/")} >Home</button>
          <button className="menu-item" onClick={() => navigate("/2DGeneration")} >2D Preview Generation</button>
          <button className="menu-item" onClick={() => navigate("/3DGeneration")} >3D Preview Generation</button>
          <button className="menu-item" onClick={() => navigate("/Topology")} >Topology</button>

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
          <Route path="/2DGeneration" element={<Page2DGeneration />} />
          <Route path="/3DGeneration" element={<Page3DGeneration />} />
          <Route path="/Topology" element={<Topology />} />
          <Route path="/Search" element={<PageSearch />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>

      </div>
    </div>
  )
}

export default App
