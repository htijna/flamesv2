

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FlamesGame from './FlameGame';
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App">
<BrowserRouter>
  <Routes>
    <Route path="/" element={<FlamesGame />} />
    <Route path="/akj" element={<Dashboard />} />
  </Routes>
</BrowserRouter>

    </div>
  );
}

export default App;
