import styled from "styled-components";
import { AdminNaviData } from "./data";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const AdminSidebar = () => {
  const location = useLocation();
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log(location.pathname);
    setPage(
      AdminNaviData.filter((el) => el.path === `${location.pathname}`)[0].id
    );
  }, [location]);
  return (
    <Wrapper>
      {AdminNaviData.map((el) => (
        <Nav key={el.id} focus={page === el.id}>
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
  padding: 10px 0;
`;

const Nav = styled.div<{ focus: boolean }>`
  padding: 15px 5px;
  border-bottom: 1px solid black;
  width: 200px;
  flex: 1;
  cursor: pointer;
  background-color: ${({ focus }) => focus && "#f1f1f1"};
`;
