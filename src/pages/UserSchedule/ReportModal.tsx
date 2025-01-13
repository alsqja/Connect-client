import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "../../stores/session";
import { useCreateReport } from "../../hooks/matchingApi";

interface ReportModalProps {
  onClose: () => void;
  matchingId: number;
  toId: number;
}

export const ReportModal = ({
  onClose,
  matchingId,
  toId,
}: ReportModalProps) => {
  const [reportContent, setReportContent] = useState("");
  const user = useRecoilValue(userState);
  const [postReq, postRes] = useCreateReport();

  const handleSubmit = () => {
    if (!user) {
      return;
    }
    if (!reportContent.trim()) {
      alert("신고 내용을 입력해주세요.");
      return;
    }
    postReq(toId, matchingId, reportContent);
    setReportContent("");
    onClose();
  };

  useEffect(() => {
    if (postRes.data && postRes.called) {
      alert("신고 완료 되었습니다.");
      window.location.reload();
    }
  }, [postRes]);

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>신고하기</Title>
          <CloseButton onClick={onClose}>X</CloseButton>
        </Header>
        <Content>
          <Description>신고하시려는 내용을 입력해주세요.</Description>
          <TextArea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            placeholder="신고 내용을 입력하세요."
          />
        </Content>
        <Footer>
          <ActionButton onClick={handleSubmit}>제출</ActionButton>
          <CancelButton onClick={onClose}>닫기</CancelButton>
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
  width: 400px;
  max-width: 90%;
  border-radius: 10px;
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
  color: #888;

  &:hover {
    color: #555;
  }
`;

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: none;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px;
  background-color: #f4f4f4;
  border-top: 1px solid #ddd;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #999;
  }
`;
