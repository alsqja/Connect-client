import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { UserPointCharge } from "./pages/UserPointCharge";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/globalStyle.css";
import { AdminUser } from "./pages/AdminUser";
import { AdminCategory } from "./pages/AdminCategory";
import { UserMain } from "./pages/UserMain";
import { UserMy } from "./pages/UserMy";
import { AdminPaymentManage } from "./pages/AdminPaymentManage";
import { UserSchedule } from "./pages/UserSchedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/user" element={<AdminUser />} />
        <Route path="/point" element={<UserPointCharge />} />
        <Route path="/admin/category" element={<AdminCategory />} />
        <Route path="/" element={<UserMain />} />
        <Route path="/user/my" element={<UserMy />} />
        <Route path="/admin/payment" element={<AdminPaymentManage />} />
        <Route path="/schedule/:id" element={<UserSchedule />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
