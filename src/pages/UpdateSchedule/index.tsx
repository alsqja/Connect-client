import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { DateSelector } from "../../components/DateSelector";
import { TextField } from "../../components/TextField";
import { SearchMap } from "../../components/Map";
import { useGetAllCategories, useGetTopCategories } from "../../hooks/adminApi";
import {
  useGetSchedule,
  useGetScheduleContent,
  useUpdateSchedule,
} from "../../hooks/scheduleApi";
import { IPostScheduleData } from "../UserMain/data";

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

export const ScheduleEditPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  // API 훅
  const [getCategoriesReq, getCategoriesRes] = useGetAllCategories();
  const [getTopReq, getTopRes] = useGetTopCategories();
  const [getScheduleDetailReq, getScheduleDetailRes] = useGetSchedule();
  const [updateScheduleReq, updateScheduleRes] = useUpdateSchedule();
  const [getSubCategoryReq, getSubCategoryRes] = useGetScheduleContent();

  // 스케줄 기본 정보
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);
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

  // --------------------------------------
  // 1) 데이터 로드
  // --------------------------------------
  useEffect(() => {
    if (scheduleId) {
      getScheduleDetailReq(+scheduleId); // 스케줄 상세 정보
      getSubCategoryReq(+scheduleId); // 스케줄에 연결된 서브카테고리 목록
    }
    getCategoriesReq(); // 전체 카테고리
    getTopReq(); // TOP10 카테고리
  }, [
    scheduleId,
    getScheduleDetailReq,
    getSubCategoryReq,
    getCategoriesReq,
    getTopReq,
  ]);

  // 스케줄 기본 정보 세팅
  useEffect(() => {
    if (getScheduleDetailRes.data && getScheduleDetailRes.called) {
      const detail = getScheduleDetailRes.data.data;
      setScheduleDate(detail.date);
      setScheduleTitle(detail.title);
      setScheduleDetail(detail.details);
      setAddress(detail.address);
      setLatitude(detail.latitude);
      setLongitude(detail.longitude);
    }
  }, [getScheduleDetailRes]);

  // 스케줄에 이미 연결된 subCategory 목록 세팅
  useEffect(() => {
    if (getSubCategoryRes.data && getSubCategoryRes.called) {
      // 여기서 data 예시:
      // [
      //   {
      //     "id": 2,
      //     "subCategoryId": 1,
      //     "subCategoryName": "축구",
      //     "description": "축구",
      //     "subCategoryImageUrl": ""
      //   }
      // ]
      // 아래처럼 ISubCategory 형태로 매핑:
      const mappedSubCategories: ISubCategory[] =
        getSubCategoryRes.data.data.map((item: any) => ({
          id: item.subCategoryId,
          name: item.subCategoryName,
          imageUrl: item.subCategoryImageUrl,
          categoryId: 0, // categoryId 정보가 없으므로 일단 0 또는 null
        }));
      setSelectedSubCategories(mappedSubCategories);
    }
  }, [getSubCategoryRes.called, getSubCategoryRes.data]);

  // 전체 카테고리
  useEffect(() => {
    if (getCategoriesRes.data && getCategoriesRes.called) {
      setCategories(getCategoriesRes.data.data);
    }
  }, [getCategoriesRes]);

  // TOP10 서브카테고리
  useEffect(() => {
    if (getTopRes.data && getTopRes.called) {
      setTopTenSubCategories(getTopRes.data.data);
    }
  }, [getTopRes]);

  // 스케줄 수정 응답
  useEffect(() => {
    if (updateScheduleRes.data && updateScheduleRes.called) {
      alert("일정이 수정되었습니다.");
      navigate(`/schedule/${scheduleId}`);
    }
  }, [updateScheduleRes, navigate, scheduleId]);

  // -----------------------------
  // 2) 이벤트 핸들러
  // -----------------------------
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

  const handleSubmit = useCallback(() => {
    if (!scheduleId) {
      alert("스케줄 ID가 없습니다.");
      return;
    }
    if (!latitude || !longitude || selectedSubCategories.length === 0) {
      alert("필수 정보를 입력해주세요.");
      return;
    }
    const patchData: IPostScheduleData = {
      date: scheduleDate,
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
    updateScheduleReq(+scheduleId, patchData);
  }, [
    scheduleId,
    scheduleDate,
    scheduleTitle,
    scheduleDetail,
    selectedSubCategories,
    address,
    latitude,
    longitude,
    updateScheduleReq,
  ]);

  // -----------------------------
  // 3) 렌더링
  // -----------------------------
  return (
    <Container>
      <Header>스케줄 수정</Header>

      {/* 날짜 */}
      <Label>날짜</Label>
      <DateSelector initialDate={scheduleDate} onDateChange={setScheduleDate} />

      {/* 제목 */}
      <Label style={{ marginTop: "20px" }}>제목</Label>
      <TextField
        title="스케줄 제목"
        width={550}
        value={scheduleTitle}
        onChange={setScheduleTitle}
      />

      {/* 장소 */}
      <Label>장소</Label>
      <LocationContainer>
        <TextField value={address} onChange={setAddress} width={480} title="" />
        <SearchButton onClick={() => setMapOpen(true)}>검색</SearchButton>
      </LocationContainer>

      {/* 카테고리 목록 */}
      <Label>카테고리 선택 (최대 10개)</Label>
      <Top10Button onClick={() => setTop10Visible(true)}>
        인기 TOP10 보기
      </Top10Button>

      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: "20px" }}>
          <CategoryHeader>{category.name}</CategoryHeader>
          <SubCategoryContainer>
            {category.subCategories.map((sub) => {
              // selected={ selectedSubCategories.includes(sub) } => reference 비교라 문제
              // ID가 같으면 true
              const isSelected = selectedSubCategories.some(
                (c) => c.id === sub.id
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

      {/* 일정 설명 */}
      <Label>스케줄 설명</Label>
      <TextArea
        value={scheduleDetail}
        onChange={(e) => setScheduleDetail(e.target.value)}
      />

      {/* 제출 버튼 */}
      <SubmitButton onClick={handleSubmit}>스케줄 수정하기</SubmitButton>

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
                const subData: ISubCategory = {
                  id: sub.id,
                  name: sub.name,
                  imageUrl: sub.imageUrl,
                  categoryId: sub.categoryId,
                };
                const isSelected = selectedSubCategories.some(
                  (s) => s.id === subData.id
                );
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
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

/* 상단 헤더 */
const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

/* 라벨 */
const Label = styled.label`
  font-weight: bold;
`;

/* 텍스트 영역 */
const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dbdbdb;
`;

/* 스케줄 수정 버튼 */
const SubmitButton = styled.button`
  background: #f39c12;
  color: white;
  padding: 12px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  &:hover {
    background: #e67e22;
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

/* 장소 입력 영역 (검색 버튼 포함) */
const LocationContainer = styled.div`
  display: flex;
  gap: 10px;
`;

/* 인기 TOP10 보기 버튼 */
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

/* 서브카테고리 아이템 */
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

/* 모달 오버레이 (뒷배경) */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* 모달 내부 래퍼 */
const ModalWrapper = styled.div`
  background: #fff;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
  padding: 20px;
`;

/* 모달 닫기 버튼 */
const CloseButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
`;

/* 모달 제목 */
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

/* 카드 */
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
