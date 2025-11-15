import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Index_Page } from './components/Index_Page';
import { Billing_page } from './pages/Billing_page';
import { Footer } from './components/Footer';


function App() {

  return (
    <>
      <Router>
          <Index_Page/>
            <Routes>
              <Route path="/" element={<Billing_page />} />

            </Routes>
            <Footer/>
      </Router>
    </>
  )
}

export default App
