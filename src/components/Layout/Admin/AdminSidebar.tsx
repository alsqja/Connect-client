import styled from "styled-components";
import { AdminNaviData } from "./data";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const AdminSidebar = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const delId = location.pathname.split("/" + location.pathname.split("/").reverse()[0])[0];
    console.log("location", location.pathname);

    setPage(
      AdminNaviData.filter((el) => el.path === `${location.pathname === el.path ? location.pathname : delId}`)[0].id
    );
  }, [location]);
  return (
    <Wrapper>
      {AdminNaviData.map((el) => (
        <Nav
          key={el.id}
          focus={page === el.id}
          onClick={() => navigate(el.path)}
        >
          {el.label}
        </Nav>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  position: fixed;
  left: 30px;
  top: 100px;
  overflow: hidden;
`;

const Nav = styled.div<{ focus: boolean }>`
  height: 46px;
  margin: 0;
  padding: 0 10px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${({ focus }) => (focus ? "#f1f1f1" : "white")};
  position: relative;
  cursor: pointer;
  
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 10px;
    right: 10px;
    height: 1px;
    background-color: #dbdbdb;
  }
`;
