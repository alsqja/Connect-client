import styled from "styled-components";
import { Calendar } from "../../components/Calendar";
import { useCallback, useEffect, useState } from "react";
import { ICalendarSchedule } from "./data";
import { useGetAllSchedules } from "../../hooks/scheduleApi";
import { useNavigate } from "react-router-dom";

export const UserMain = () => {
  const [schedules, setSchedules] = useState<ICalendarSchedule[]>([]);
  const [getSchedulesReq, getSchedulesRes] = useGetAllSchedules();
  const [activeDate, setActiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const navigate = useNavigate();

  useEffect(() => {
    getSchedulesReq(null, null, activeDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate]);

  useEffect(() => {
    if (getSchedulesRes.called && getSchedulesRes.data) {
      setSchedules(getSchedulesRes.data.data.data);
    }
  }, [getSchedulesRes]);

  const handleClick = useCallback(
    (date: string | null) => {
      navigate("/create-schedule", {
        state: { date },
      });
    },
    [navigate]
  );

  return (
    <UserMainContainer>
      <div style={{ width: "100%" }}>
        <Calendar
          schedules={schedules}
          handleClick={handleClick}
          setActiveDate={setActiveDate}
        />
      </div>
    </UserMainContainer>
  );
};

const UserMainContainer = styled.div`
  background-color: #fff;
  width: 1000px;
  height: 750px;
  margin: 0 150px;
  align-content: center;
  border-radius: 10px;
  border: 1px solid #000;
`;
