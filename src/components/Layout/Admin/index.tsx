import React, { useEffect } from "react";
import styled from "styled-components";
import { AdminSidebar } from "./AdminSidebar";
import { useRecoilValue } from "recoil";
import { userState } from "../../../stores/session";
import { UserHeader } from "../User/UserHeader";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user?.role === "USER") {
      window.location.replace("/login");
      return;
    }
  }, [user]);

  return (
    <Wrapper>
      <UserHeader />
      <AdminSidebar />
      <Container>{user?.role === "ADMIN" && <Outlet />}</Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #f3f3f3;
  height: 100vh;
  width: 100%;
  position: fixed;
`;

const Container = styled.div`
  display: flex;
  margin-left: 300px;
  margin-top: 100px;
`;
