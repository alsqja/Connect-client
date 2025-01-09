import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { PointPage } from "./pages/Point";
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/globalStyle.css'
import { AdminUser } from "./pages/AdminUser";
import { AdminCategory } from "./pages/AdminCategory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/admin/user" element={<AdminUser/>}/>
        <Route path="/point" element={<PointPage/>}/>
        <Route path="/admin/category" element={<AdminCategory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
