import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import styled from "styled-components";

interface DateInputProps {
  initialDate: string | null; // 초기 날짜 "yyyymmdd" 형식
  onDateChange: (date: string) => void; // 날짜 변경 핸들러
  type?: "date" | "dateTime" | "month";
  timeCaption?: string;
}

export const DateSelector = ({ initialDate, onDateChange, type = "date", timeCaption = "시작시간" }: DateInputProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate ? parse(initialDate, type === "month" ? "yyyy-MM" : type === "dateTime" ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd", new Date()) : new Date()
  );

  useEffect(() => {
    setSelectedDate(initialDate ? parse(initialDate, type === "month" ? "yyyy-MM" : type === "dateTime" ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd", new Date()) : new Date())
  }, [initialDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      let formattedDate = "";
      if (type === "month") {
        formattedDate = format(date, "yyyy-MM");
      } else if (type === "dateTime") {
        formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
      } else {
        formattedDate = format(date, "yyyy-MM-dd");
      }
      onDateChange(formattedDate);
    }
  };

  return (
    <DatePickerWrapper>
      <StyledDatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat={type === "month" ? "yyyy-MM" : type === "dateTime" ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd"}
        placeholderText="날짜를 선택하세요"
        showMonthYearPicker={type === "month"}
        showPopperArrow={false}
        portalId="root-datepicker-portal"
        showTimeSelect={type === "dateTime"}
        timeFormat="HH:mm:ss"
        timeCaption={timeCaption}
      />
    </DatePickerWrapper>
  );
};

const DatePickerWrapper = styled.div`
  /* position: relative; */
  /* width: 100%; */
`;

const StyledDatePicker = styled(DatePicker as any)`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;
