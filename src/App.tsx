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
import { AdminCoupon } from "./pages/AdminCoupon";
import { AdminCouponDetail } from "./pages/AdminCoupon/AdminCouponDetail";
import { UserFeed } from "./pages/UserFeed";
import { Chatting } from "./pages/Chatting";
import { IssueCoupon } from "./pages/IssueCoupon";
import { ScheduleCreationPage } from "./pages/CreateSchedule";
import { ScheduleEditPage } from "./pages/UpdateSchedule";
import { Membership } from "./pages/Membership";
import { AdminChart } from "./pages/AdminChart";

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
          <Route path="user/:id/feed" element={<UserFeed />} />
          <Route path="/chat/rooms/:roomId" element={<Chatting />} />
          <Route path="/issue/coupon" element={<IssueCoupon />} />
          <Route path="/create-schedule" element={<ScheduleCreationPage />} />
          <Route
            path="/update-schedule/:scheduleId"
            element={<ScheduleEditPage />}
          />
          <Route path="/user/membership" element={<Membership />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/category" element={<AdminCategory />} />
          <Route path="/admin/payment" element={<AdminPaymentManage />} />
          <Route path="/admin/chart" element={<AdminChart />} />
          <Route path="/admin/coupon">
            <Route index element={<AdminCoupon />} />
            <Route path=":id" element={<AdminCouponDetail />} />
            <Route path="new" element={<AdminCouponDetail />} />
          </Route>
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
