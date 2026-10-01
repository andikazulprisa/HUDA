import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Quran from "./pages/Quran";
import QuranDetail from "./pages/QuranDetail";
import Hadith from "./pages/Hadith";
import HadithDetail from "./pages/HadithDetail";
import Dua from "./pages/Dua";
import Sunnah from "./pages/Sunnah";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/quran/:number" element={<QuranDetail />} />

        <Route path="/hadith" element={<Hadith />} />
        <Route path="/hadith/:collection/:number" element={<HadithDetail />} />

        <Route path="/dua" element={<Dua />} />
        <Route path="/sunnah" element={<Sunnah />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
