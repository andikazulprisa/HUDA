import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import Dua from "./pages/Dua";
import Sunnah from "./pages/Sunnah";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/hadith" element={<Hadith />} />
        <Route path="/dua" element={<Dua />} />
        <Route path="/sunnah" element={<Sunnah />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
