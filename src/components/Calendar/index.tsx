import React, { useState } from "react";
import styled from "styled-components";
import { ICalendarSchedule } from "../../pages/UserMain/data";

interface IProps {
  schedules: ICalendarSchedule[];
  handleClick: (date: string | null) => void;
}

export const Calendar = ({ schedules, handleClick }: IProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const firstWeekday = firstDayOfMonth.getDay();
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const dates = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    dates.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
    });
  }
  for (let i = 1; i <= totalDaysInMonth; i++) {
    dates.push({
      day: i,
      isCurrentMonth: true,
    });
  }
  const nextMonthDays = 42 - dates.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    dates.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    const week = dates.slice(i, i + 7);
    if (week.some((date) => date.isCurrentMonth)) {
      weeks.push(week);
    }
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <ArrowButton onClick={handlePrevMonth}>{"<"}</ArrowButton>
        <div>
          {currentDate.toLocaleString("default", {
            year: "numeric",
            month: "long",
          })}
        </div>
        <ArrowButton onClick={handleNextMonth}>{">"}</ArrowButton>
      </CalendarHeader>
      <CalendarGrid>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <DayLabel key={day}>{day}</DayLabel>
        ))}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, index) => {
              const fullDate = date.isCurrentMonth
                ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`
                : null;
              const event = schedules.find((event) => event.date === fullDate);

              return (
                <DayCell
                  key={index}
                  isToday={
                    date.isCurrentMonth &&
                    fullDate === new Date().toISOString().split("T")[0]
                  }
                  isCurrentMonth={date.isCurrentMonth}
                  isWeekend={index === 6}
                  isSunday={index === 0}
                >
                  <DateText>{date.day}</DateText>
                  {event ? (
                    <EventLabel>{event.title}</EventLabel>
                  ) : (
                    date.isCurrentMonth && (
                      <AddEventButton onClick={() => handleClick(fullDate)}>
                        +
                      </AddEventButton>
                    )
                  )}
                </DayCell>
              );
            })}
          </React.Fragment>
        ))}
      </CalendarGrid>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: auto;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  padding: 10px 20px;
`;

const DayLabel = styled.div`
  text-align: center;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
`;

const DayCell = styled.div<{
  isToday?: boolean;
  isCurrentMonth?: boolean;
  isWeekend?: boolean;
  isSunday?: boolean;
}>`
  min-height: 100px;
  background-color: ${(props) => (props.isToday ? "#f0faff" : "#fff")};
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;
  padding: 5px;
  color: ${(props) =>
    props.isCurrentMonth
      ? props.isSunday
        ? "#ff6666"
        : props.isWeekend
        ? "#6699ff"
        : "#333"
      : "#ccc"};
`;

const DateText = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 14px;
`;

const EventLabel = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: #ffe082;
  color: #333;
  font-size: 12px;
  border-radius: 4px;
  padding: 2px 5px;
  cursor: pointer;
`;

const AddEventButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #e3f2fd;
  color: #0277bd;
  font-size: 14px;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #bbdefb;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #000;
  }
`;
