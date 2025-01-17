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
import { UserLayout } from "./components/Layout/User";
import { AdminLayout } from "./components/Layout/Admin";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserMain />} />
          <Route path="/point" element={<UserPointCharge />} />
          <Route path="/user/my/:type" element={<UserMy />} />
          <Route path="/schedule/:id" element={<UserSchedule />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/category" element={<AdminCategory />} />
          <Route path="/admin/payment" element={<AdminPaymentManage />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
