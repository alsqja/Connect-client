import styled from "styled-components";
import { UserHeader } from "./UserHeader";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    return <MobileMessage>PC 환경에서만 사용 가능합니다.</MobileMessage>;
  }

  return (
    <Wrapper>
      <UserHeader />
      <Container>
        <Outlet />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #f3f3f3;
  height: 100vh;
  width: 100%;
  position: fixed;
  overflow-y: scroll;
  scrollbar-width: none;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 100px;
  justify-content: center;
`;

const MobileMessage = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: red;
  background-color: #fff;
`;
