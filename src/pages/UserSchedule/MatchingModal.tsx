import React from "react";
import styled from "styled-components";
import { ICreatedMatching } from "./data";

interface MatchingModalProps {
  data: ICreatedMatching | undefined;
  onClose: () => void;
  onViewDetails: (id: number) => void;
}

export const MatchingModal = ({
  data,
  onClose,
  onViewDetails,
}: MatchingModalProps) => {
  if (data === undefined) {
    onClose();
    return <></>;
  }
  return (
    <Backdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          유사한 일정이 발견되었습니다.
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Content>
          <ProfileImage
            src={data.profileUrl}
            alt={`${data.userName}의 프로필 이미지`}
          />
          <TextContainer>
            <UserName>{data.userName}님</UserName>
            <Similarity>
              유사도: {(data.similarity * 100).toFixed(2)}%
            </Similarity>
          </TextContainer>
        </Content>
        <Footer>
          <Button onClick={() => onViewDetails(data.toScheduleId)}>
            정보 보기
          </Button>
          <Button onClick={onClose} secondary>
            닫기
          </Button>
        </Footer>
      </ModalContainer>
    </Backdrop>
  );
};

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  width: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  background: #f1f1f1;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: #888;

  &:hover {
    color: #000;
  }
`;

const Content = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Similarity = styled.div`
  font-size: 14px;
  color: #555;
`;

const Footer = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
`;

const Button = styled.button<{ secondary?: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.secondary ? "#ccc" : "#007bff")};
  color: ${(props) => (props.secondary ? "#333" : "#fff")};

  &:hover {
    background-color: ${(props) => (props.secondary ? "#bbb" : "#0056b3")};
  }
`;
