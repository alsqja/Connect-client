import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useCreateSchedule } from "../../hooks/scheduleApi";
import { DateSelector } from "../../components/DateSelector";
import { TextField } from "../../components/TextField";
import { SearchMap } from "../../components/Map";
import { IPostScheduleData } from "../UserMain/data";
import { useGetAllCategories, useGetTopCategories } from "../../hooks/adminApi";
import { useLocation } from "react-router-dom";

interface ICategory {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  subCategories: ISubCategory[];
}

interface ISubCategory {
  id: number;
  name: string;
  imageUrl: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ITopSubCategory {
  id: number;
  name: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  registeredCount: number;
}

export const ScheduleCreationPage = () => {
  // -----------------------------
  // 1) 상태값 정의
  // -----------------------------
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    location.state?.date || new Date().toISOString().split("T")[0]
  );
  const [scheduleTitle, setScheduleTitle] = useState<string>("");
  const [scheduleDetail, setScheduleDetail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // 카테고리/서브카테고리
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [topTenSubCategories, setTopTenSubCategories] = useState<
    ITopSubCategory[]
  >([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    ISubCategory[]
  >([]);

  // 지도 검색 모달
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  // "인기 TOP 10" 모달 열림 여부
  const [top10Visible, setTop10Visible] = useState<boolean>(false);

  // API 훅
  const [getCategoriesReq, getCategoriesRes] = useGetAllCategories();
  const [postScheduleReq, postScheduleRes] = useCreateSchedule();
  const [getTopReq, getTopRes] = useGetTopCategories();

  // -----------------------------
  // 2) 데이터 로드 (useEffect)
  // -----------------------------
  useEffect(() => {
    getCategoriesReq();
    getTopReq();
  }, [getCategoriesReq, getTopReq]);

  useEffect(() => {
    if (getCategoriesRes.data && getCategoriesRes.called) {
      setCategories(getCategoriesRes.data.data);
    }
  }, [getCategoriesRes]);

  useEffect(() => {
    if (getTopRes.data && getTopRes.called) {
      setTopTenSubCategories(getTopRes.data.data);
    }
  }, [getTopRes]);

  useEffect(() => {
    if (postScheduleRes.data && postScheduleRes.called) {
      alert("일정이 생성되었습니다.");
      window.location.replace("/main");
    }
  }, [postScheduleRes]);

  // -----------------------------
  // 3) 이벤트 핸들러
  // -----------------------------
  /** 서브카테고리 선택/해제 */
  const handleSubCategoryClick = useCallback((subCategory: ISubCategory) => {
    setSelectedSubCategories((prev) => {
      // 이미 선택된 카테고리면 해제
      if (prev.some((c) => c.id === subCategory.id)) {
        return prev.filter((c) => c.id !== subCategory.id);
      }
      // 아니면 추가(최대 10개)
      return prev.length < 10 ? [...prev, subCategory] : prev;
    });
  }, []);

  /** 일정 생성 */
  const handleSubmit = useCallback(() => {
    if (!latitude || !longitude || selectedSubCategories.length === 0) {
      alert("필수 정보를 입력해주세요.");
      return;
    }
    const scheduleData: IPostScheduleData = {
      date: selectedDate,
      title: scheduleTitle,
      details: scheduleDetail,
      contents: selectedSubCategories.map((sub) => ({
        id: sub.id,
        description: sub.name,
      })),
      address,
      latitude,
      longitude,
    };
    postScheduleReq(scheduleData);
  }, [
    selectedDate,
    scheduleTitle,
    scheduleDetail,
    selectedSubCategories,
    address,
    latitude,
    longitude,
    postScheduleReq,
  ]);

  // -----------------------------
  // 4) 렌더링
  // -----------------------------
  return (
    <Container>
      <Header>일정 생성</Header>

      <Label>날짜</Label>
      <DateSelector initialDate={selectedDate} onDateChange={setSelectedDate} />

      <Label>제목</Label>
      <TextField
        title="일정 제목"
        width={550}
        value={scheduleTitle}
        onChange={setScheduleTitle}
      />

      <Label>장소</Label>
      <LocationContainer>
        <TextField value={address} onChange={setAddress} width={480} title="" />
        <SearchButton onClick={() => setMapOpen(true)}>검색</SearchButton>
      </LocationContainer>

      <Label>카테고리 선택 (최대 10개)</Label>
      <Top10Button onClick={() => setTop10Visible(true)}>
        인기 TOP10 보기
      </Top10Button>

      {/* 왼쪽 카테고리 목록 */}
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: "20px" }}>
          <CategoryHeader>{category.name}</CategoryHeader>
          <SubCategoryContainer>
            {category.subCategories.map((sub) => {
              /**
               * selected 여부는 ID 비교로 확인
               */
              const isSelected = selectedSubCategories.some(
                (item) => item.id === sub.id
              );
              return (
                <SubCategoryItem
                  key={sub.id}
                  selected={isSelected}
                  onClick={() => handleSubCategoryClick(sub)}
                >
                  {sub.name}
                </SubCategoryItem>
              );
            })}
          </SubCategoryContainer>
        </div>
      ))}

      <Label>일정 설명</Label>
      <TextArea
        value={scheduleDetail}
        onChange={(e) => setScheduleDetail(e.target.value)}
      />

      <SubmitButton onClick={handleSubmit}>일정 생성</SubmitButton>

      {/* 지도 모달 */}
      {mapOpen && (
        <SearchMap
          searchValue={address}
          setSearchValue={setAddress}
          onClose={() => setMapOpen(false)}
          handleAddress={(place) => {
            setAddress(place.address_name);
            setLatitude(place.y);
            setLongitude(place.x);
            setMapOpen(false);
          }}
        />
      )}

      {/* TOP10 모달 (오버레이) */}
      {top10Visible && (
        <ModalOverlay onClick={() => setTop10Visible(false)}>
          <ModalWrapper onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setTop10Visible(false)}>X</CloseButton>
            <RightHeader>인기 서브카테고리 TOP 10</RightHeader>
            <TopListContainer>
              {topTenSubCategories.map((sub) => {
                // 모달 쪽도 ISubCategory 형태로 변환
                const subData: ISubCategory = {
                  id: sub.id,
                  name: sub.name,
                  imageUrl: sub.imageUrl,
                  categoryId: sub.categoryId,
                };
                // ID로 선택 여부 확인
                const isSelected = selectedSubCategories.some(
                  (s) => s.id === subData.id
                );

                // 이미지
                const imageSrc = sub.imageUrl
                  ? sub.imageUrl
                  : "https://via.placeholder.com/300x200?text=No+Image";

                return (
                  <TopSubCategoryCard
                    key={sub.id}
                    selected={isSelected}
                    onClick={() => handleSubCategoryClick(subData)}
                  >
                    <TopSubCategoryImage src={imageSrc} alt={sub.name} />
                    <TopSubCategoryName>
                      {sub.categoryName + " > " + sub.name}
                    </TopSubCategoryName>
                  </TopSubCategoryCard>
                );
              })}
            </TopListContainer>
          </ModalWrapper>
        </ModalOverlay>
      )}
    </Container>
  );
};

/* 전체 컨테이너 */
const Container = styled.div`
  width: 600px;
  overflow-y: auto;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

/* 페이지 상단 헤더 */
const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

/* 공통 라벨 */
const Label = styled.label`
  font-weight: bold;
`;

/* 장소 입력 영역 (검색 버튼 포함) */
const LocationContainer = styled.div`
  display: flex;
  gap: 10px;
`;

/* 대분류 카테고리 헤더 */
const CategoryHeader = styled.div`
  font-weight: bold;
  margin-top: 10px;
`;

/* 서브카테고리 목록(가로 스크롤) */
const SubCategoryContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  gap: 10px;
  scrollbar-width: none;
`;

/* 서브카테고리 아이템 (왼쪽 영역) */
const SubCategoryItem = styled.div<{ selected: boolean }>`
  padding: 8px 12px;
  border-radius: 20px;
  min-width: 80px;
  display: flex;
  justify-content: center;
  background: ${({ selected }) => (selected ? "#007bff" : "#e0e0e0")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  cursor: pointer;
  &:hover {
    background: ${({ selected }) => (selected ? "#0056b3" : "#c0c0c0")};
  }
`;

/* 일정 설명 textarea */
const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dbdbdb;
`;

/* "인기 TOP10 보기" 버튼 */
const Top10Button = styled.button`
  background: #28a745;
  color: white;
  font-weight: bold;
  padding: 5px 16px;
  border: none;
  border-radius: 5px;
  margin-left: 240px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #218838;
  }
`;

/* 일정 생성 버튼 */
const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #0056b3;
  }
`;

/* 지도 검색 버튼 */
const SearchButton = styled.button`
  padding: 10px 15px;
  position: relative;
  top: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  height: 50px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

/* ----------------------------- */
/* 모달 관련 스타일 */
/* ----------------------------- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  background: #fff;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
  padding: 20px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
`;

const RightHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

/* 2열 그리드 */
const TopListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

/* 인기 서브카테고리 카드 */
const TopSubCategoryCard = styled.div<{ selected: boolean }>`
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  padding: 10px;
  background: ${({ selected }) => (selected ? "#007bff" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ selected }) => (selected ? "#0056b3" : "#f5f5f5")};
  }
`;

/* 카드 안 이미지 */
const TopSubCategoryImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 6px;
`;

/* 카드 내 서브카테고리 이름 */
const TopSubCategoryName = styled.div`
  font-size: 15px;
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
`;
