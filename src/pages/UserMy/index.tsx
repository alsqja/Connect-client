import { useState } from "react";
import styled from "styled-components";
import { UserLayout } from "../../components/Layout/User";
import { UserSidebar } from "./UserSidebar";
import { Profile } from "./Profile";

export const UserMy = () => {
  const [selected, setSelected] = useState(1);

  return (
    <UserLayout>
      <Container>
        <SidebarWrapper>
          <UserSidebar />
        </SidebarWrapper>
        <MainContent>{selected === 1 && <Profile />}</MainContent>
      </Container>
    </UserLayout>
  );
};

const Container = styled.div`
  display: flex;
  width: 90%;
  margin: 0 auto;
  gap: 20px; /* 사이드바와 메인 콘텐츠 간 간격 */
`;

const SidebarWrapper = styled.div`
  width: 260px;
  flex-shrink: 0; /* 사이드바 너비 고정 */
`;

const MainContent = styled.div`
  flex: 1; /* 나머지 공간을 채우도록 확장 */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
