import { useCallback, useState } from "react";
import styled from "styled-components";
import { UserLayout } from "../../components/Layout/User";
import { UserSidebar } from "./UserSidebar";
import { Profile } from "./Profile";
import { ScheduleTable } from "./ScheduleTable";

export const UserMy = () => {
  const [selected, setSelected] = useState(1);

  const handleSelected = useCallback((id: number) => {
    setSelected(id);
  }, []);

  return (
    <UserLayout>
      <Container>
        <SidebarWrapper>
          <UserSidebar handleSelected={handleSelected} selected={selected} />
        </SidebarWrapper>
        <MainContent>
          {selected === 1 && <Profile />}
          {selected === 3 && <ScheduleTable />}
        </MainContent>
      </Container>
    </UserLayout>
  );
};

const Container = styled.div`
  display: flex;
  width: 90%;
  margin: 0 auto;
  gap: 20px;
`;

const SidebarWrapper = styled.div`
  width: 260px;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
