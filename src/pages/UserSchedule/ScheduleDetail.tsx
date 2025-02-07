import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { IContent } from "./data";
import {
  useDeleteSchedule,
  useGetScheduleContent,
} from "../../hooks/scheduleApi";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface IProps {
  id: number;
  title: string;
  details: string;
  date: string;
}

export const ScheduleDetail = ({ id, title, date, details }: IProps) => {
  const [contents, setContents] = useState<IContent[]>([]);
  const [getReq, getRes] = useGetScheduleContent();
  const [deleteReq, deleteRes] = useDeleteSchedule();
  const navigate = useNavigate();

  // 수정 버튼
  const handleEdit = useCallback(() => {
    navigate(`/update-schedule/${id}`);
  }, [navigate, id]);

  // 삭제 버튼
  const handleDelete = useCallback(() => {
    if (window.confirm("삭제하시겠습니까?")) deleteReq(id);
  }, [deleteReq, id]);

  // 일정 컨텐츠 불러오기
  useEffect(() => {
    getReq(id);
  }, [getReq, id]);

  // 불러온 컨텐츠 데이터 세팅
  useEffect(() => {
    if (getRes.data && getRes.called) {
      setContents(getRes.data.data);
    }
  }, [getRes]);

  // 삭제 API 호출 응답 처리
  useEffect(() => {
    if (deleteRes.called && !deleteRes.error && !deleteRes.loading) {
      alert("일정이 삭제되었습니다.");
      window.location.replace("/main");
    }
  }, [deleteRes.called, deleteRes.error, deleteRes.loading]);

  return (
    <Container>
      <HeaderRow>
        {/* 중앙 정렬될 제목 */}
        <HeaderText>
          {date} {title}
        </HeaderText>

        {/* 오른쪽 아이콘 버튼 묶음 */}
        <IconContainer>
          <IconButton onClick={handleEdit}>
            <AiFillEdit size={20} />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <AiFillDelete size={20} />
          </IconButton>
        </IconContainer>
      </HeaderRow>

      <Footer>{details}</Footer>

      <ContentWrapper>
        {contents.map((content) => {
          return (
            <Card key={content.id} $imageUrl={content.subCategoryImageUrl}>
              <Overlay>
                <CategoryName>{content.subCategoryName}</CategoryName>
              </Overlay>
            </Card>
          );
        })}
      </ContentWrapper>
    </Container>
  );
};

/* 전체 컨테이너 */
const Container = styled.div`
  width: 100%;
  max-width: 500px;
  /* margin: auto; */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

/* 상단 영역 (제목 + 아이콘) */
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

/* 제목 텍스트: flex:1 로 중앙 배치, text-align:center */
const HeaderText = styled.h2`
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

/* 오른쪽 아이콘 묶음 */
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* 아이콘 버튼 */
const IconButton = styled.div`
  cursor: pointer;
  color: #555;

  &:hover {
    color: #000;
  }
`;

/* 일정 설명 */
const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

/* 컨텐츠 목록 */
const ContentWrapper = styled.div`
  max-height: calc(100vh - 200px - 10vh);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scrollbar-width: none;
`;

/* 컨텐츠 카드 */
const Card = styled.div<{ $imageUrl?: string }>`
  position: relative;
  min-height: 150px;
  background-image: ${({ $imageUrl }) =>
    $imageUrl
      ? `url("${$imageUrl}")`
      : "linear-gradient(135deg, #e0e0e0, #f5f5f5)"};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
  }
`;

/* 어두운 오버레이 + 텍스트 */
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); /* 어두운 오버레이 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
  text-align: center;
`;

/* 서브카테고리 이름 */
const CategoryName = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

/* 서브카테고리 설명 */
const Description = styled.p`
  font-size: 16px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;
