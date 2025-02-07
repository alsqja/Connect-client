import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ISchedule } from "../UserMy/data";
import { IContent } from "./data";
import { useGetSchedule, useGetScheduleContent } from "../../hooks/scheduleApi";

interface Props {
  onClose: () => void;
  id: number | undefined;
  handleSubmit: () => void;
}

export const ScheduleModal = ({ onClose, id, handleSubmit }: Props) => {
  const [schedule, setSchedule] = useState<ISchedule>();
  const [contents, setContents] = useState<IContent[]>([]);
  const [getScheduleReq, getScheduleRes] = useGetSchedule();
  const [getContentsReq, getContentsRes] = useGetScheduleContent();

  useEffect(() => {
    if (!id) {
      alert("일정정보를 불러올 수 없습니다.");
      window.location.reload();
      return;
    }
    getScheduleReq(id);
    getContentsReq(id);
  }, [id]);

  useEffect(() => {
    if (getScheduleRes.data && getScheduleRes.called) {
      setSchedule(getScheduleRes.data.data);
    }
  }, [getScheduleRes]);

  useEffect(() => {
    if (getContentsRes.data && getContentsRes.called) {
      setContents(getContentsRes.data.data);
    }
  }, [getContentsRes]);

  if (!schedule) {
    return <Overlay>로딩중</Overlay>;
  }

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>일정 상세 정보</Title>
          <CloseButton onClick={onClose}>X</CloseButton>
        </Header>
        <Content>
          <MainInfo>
            <h2>{schedule.title}</h2>
            <DateText>생성된 일정: {schedule.date}</DateText>
            <DetailsText>내용: {schedule.details}</DetailsText>
          </MainInfo>
          <SubCategoryList>
            <h3>컨텐츠</h3>
            <ScrollableList>
              {contents.map((subCategory) => (
                <SubCategoryLabel key={subCategory.id}>
                  {subCategory.subCategoryName}
                </SubCategoryLabel>
              ))}
            </ScrollableList>
          </SubCategoryList>
        </Content>
        <Footer>
          <ActionButton onClick={handleSubmit}>매칭 신청</ActionButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  width: 600px;
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 16px;
`;

const MainInfo = styled.div`
  margin-bottom: 20px;
`;

const DateText = styled.p`
  font-size: 14px;
  color: #555;
`;

const DetailsText = styled.p`
  font-size: 16px;
  margin-top: 10px;
  color: #333;
`;

const SubCategoryList = styled.div`
  margin-top: 20px;
`;

const ScrollableList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
`;

const SubCategoryLabel = styled.div`
  padding: 8px 12px;
  background-color: #e2e0ff;
  color: #4b3fcb;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
`;

const Footer = styled.div`
  padding: 16px;
  background: #f4f4f4;
  border-top: 1px solid #ddd;
  text-align: right;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
