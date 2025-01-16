import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaQuestionCircle } from "react-icons/fa";
import MainColorButton from "../../components/Button/MainColorButton";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <AnimatedIcon />
      <Title>404</Title>
      <Subtitle>페이지를 찾을 수 없습니다.<br />이전 페이지로 돌아가시려면 돌아가기 버튼을 눌러주세요.</Subtitle>
      <MainButton onClick={() => navigate(-1)}>돌아가기</MainButton>
    </NotFoundContainer>
  );
}

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
  color: #343a40;
`;

const AnimatedIcon = styled(FaQuestionCircle)`
  font-size: 4rem;
  color: #17a2b8;
  margin-bottom: 20px;
  animation: ${bounce} 1.5s infinite;
`;

const Title = styled.h1`
  font-size: 5rem;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin: 20px 0;
`;

const MainButton = styled(MainColorButton)`
  width: 150px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
`