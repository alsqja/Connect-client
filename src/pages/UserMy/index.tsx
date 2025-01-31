import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { UserSidebar } from "./UserSidebar";
import { Profile } from "./Profile";
import { ScheduleTable } from "./ScheduleTable";
import { PaymentTable } from "./PaymentTable";
import { ReportTable } from "./ReportTable";
import { PointTable } from "./PointTable";
import { useNavigate, useParams } from "react-router-dom";
import { pathNum } from "./data";
import { CouponTable } from "./CouponTable";

export const UserMy = () => {
  const { type } = useParams<{ type: string }>();
  const [selected, setSelected] = useState(1);
  const navigate = useNavigate();

  const handleSelected = useCallback((id: number) => {
    setSelected(id);
    navigate(`/user/my/${pathNum[id - 1]}`)
  }, []);

  useEffect(() => {
    pathNum.map((data, index) => {
      if (data === type) {
        handleSelected(index + 1);
      }
    })
  }, []);

  return (
    <>
      <Container>
        <SidebarWrapper>
          <UserSidebar handleSelected={handleSelected} selected={selected} />
        </SidebarWrapper>
        <MainContent>
          {selected === 1 && <Profile />}
          {selected === 2 && <PaymentTable />}
          {selected === 3 && <ScheduleTable />}
          {selected === 4 && <PointTable />}
          {selected === 5 && <CouponTable />}
          {selected === 6 && <ReportTable />}
        </MainContent>
      </Container>
    </>
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
