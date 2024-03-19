import React from 'react'
import Home from './Components/Home'
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
  useNavigate,
} from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>

  )
}
//app.jsx
export default App;