import styled from "styled-components";
import { UserLayout } from "../../components/Layout/User";
import { Calendar } from "../../components/Calendar";
import { useCallback, useEffect, useState } from "react";
import { ICalendarSchedule, IPostSubCategories } from "./data";
import { useCreateSchedule, useGetAllSchedules } from "../../hooks/scheduleApi";
import { TitleModal } from "../../components/TitleModal/TitleModal";
import { DateSelector } from "../../components/DateSelector";
import { TextField } from "../../components/TextField";
import { Dropdown, IOption } from "../../components/Dropdown";
import { useGetAllCategories } from "../../hooks/adminApi";
import { SearchMap } from "../../components/Map";

export const UserMain = () => {
  const [schedules, setSchedules] = useState<ICalendarSchedule[]>([]);
  const [getSchedulesReq, getSchedulesRes] = useGetAllSchedules();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [subCates, setSubCates] = useState<IPostSubCategories[]>([]);
  const [subOpen, setSubOpen] = useState(false);
  const [categories, setCategories] = useState<IOption[]>([]);
  const [subCategories, setSubCategories] = useState<IOption[]>([]);
  const [getCateReq, getCateRes] = useGetAllCategories();
  const [activeCate, setActiveCate] = useState<IOption>();
  const [activeSub, setActiveSub] = useState<IOption>();
  const [scheduleDetail, setScheduleDetail] = useState("");
  const [contentDetail, setContentDetail] = useState("");
  const [postScheduleReq, postScheduleRes] = useCreateSchedule();
  const [searchValue, setSearchValue] = useState("");
  const [map, setMap] = useState(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [activeDate, setActiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    getCateReq();
  }, []);

  useEffect(() => {
    if (getCateRes.data && getCateRes.called) {
      setCategories(
        getCateRes.data.data.map((el: any) => {
          return { id: el.id, label: el.name };
        })
      );
    }
  }, [getCateRes]);

  useEffect(() => {
    getSchedulesReq(null, null, activeDate);
  }, [activeDate]);

  useEffect(() => {
    if (getSchedulesRes.called && getSchedulesRes.data) {
      setSchedules(getSchedulesRes.data.data.data);
    }
  }, [getSchedulesRes]);

  const handleClick = useCallback((date: string | null) => {
    setSelectedDate(date);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSubCates([]);
    setSelectedDate(null);
    setName("");
    setActiveCate(undefined);
    setActiveSub(undefined);
    setContentDetail("");
    setScheduleDetail("");
    setSearchValue("");
    setAddress("");
    setLatitude(undefined);
    setLongitude(undefined);
  }, []);

  const handleClickCate = useCallback(
    (selected: IOption) => {
      setActiveCate(selected);
      if (getCateRes.data.data) {
        setSubCategories(
          getCateRes.data.data
            .filter((el: any) => el.id === selected.id)[0]
            .subCategories.map((sub: any) => {
              return { id: sub.id, label: sub.name };
            })
        );
      }
    },
    [getCateRes.data]
  );

  const handleClickSub = useCallback((selected: IOption) => {
    setActiveSub(selected);
  }, []);

  const handleAddSub = useCallback(() => {
    if (!activeSub) {
      alert("하위 카테고리를 선택해주세요");
      return;
    }

    if (!contentDetail) {
      alert("일정 내용을 입력해주세요.");
      return;
    }

    if (subCates.find((el) => el.id === activeSub.id)) {
      alert("이미 선택한 하위 카테고리입니다");
      setActiveCate(undefined);
      setActiveSub(undefined);
      setContentDetail("");
      return;
    }

    setSubCates([
      ...subCates,
      { id: activeSub.id, name: activeSub.label, description: contentDetail },
    ]);

    setActiveCate(undefined);
    setActiveSub(undefined);
    setContentDetail("");
  }, [activeSub, contentDetail, subCates]);

  const handleSubmit = useCallback(() => {
    if (!latitude || !longitude) {
      alert("장소를 선택해주세요");
      return;
    }
    postScheduleReq({
      date: selectedDate,
      title: name,
      details: scheduleDetail,
      contents: subCates,
      address: address,
      latitude: latitude,
      longitude: longitude,
    });
  }, [
    address,
    latitude,
    longitude,
    name,
    postScheduleReq,
    scheduleDetail,
    selectedDate,
    subCates,
  ]);

  useEffect(() => {
    if (postScheduleRes.data && postScheduleRes.called) {
      alert("일정이 생성되었습니다.");
      window.location.reload();
    }
  }, [postScheduleRes]);

  const handleMapClose = useCallback(() => {
    if (!address) {
      setSearchValue("");
    }
    setMap(false);
  }, [address]);

  const handleAddress = useCallback((place: any) => {
    setAddress(place.address_name);
    setLatitude(place.y);
    setLongitude(place.x);
    setSearchValue(place.place_name);
    setMap(false);
  }, []);

  const handleRemoveSubCate = useCallback(
    (index: number) => {
      setSubCates((prevSubCates) => prevSubCates.filter((_, i) => i !== index));
    },
    [setSubCates]
  );

  return (
    <UserLayout>
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", height: "100px" }}>쿠폰</div>
        <Calendar
          schedules={schedules}
          handleClick={handleClick}
          setActiveDate={setActiveDate}
        />
      </div>
      {open && (
        <TitleModal title="일정 생성" width={500} onClose={handleClose}>
          <ModalContainer>
            <FlexContainer>
              날짜
              <div style={{ width: "320px" }}>
                <DateSelector
                  initialDate={selectedDate}
                  onDateChange={(date: string) => setSelectedDate(date)}
                />
              </div>
            </FlexContainer>
            <FlexContainer>
              제목
              <TextField title="일정 제목" value={name} onChange={setName} />
            </FlexContainer>
            <FlexContainer>
              장소
              <FlexContainer style={{ width: "320px" }}>
                <TextField
                  value={searchValue}
                  onChange={setSearchValue}
                  width={250}
                  title=""
                />
                <SearchButton onClick={() => setMap(true)}>검색</SearchButton>
              </FlexContainer>
            </FlexContainer>
            <FlexContainer>
              컨텐츠
              <ContentContainer>
                {subCates.map((i, index) => (
                  <Label key={i.id}>
                    {i.name}
                    <RemoveButton onClick={() => handleRemoveSubCate(index)}>
                      x
                    </RemoveButton>
                  </Label>
                ))}
                <AddLabelButton onClick={() => setSubOpen(true)}>
                  +
                </AddLabelButton>
              </ContentContainer>
            </FlexContainer>
            <ModalTextArea
              placeholder="일정 설명을 입력해주세요."
              value={scheduleDetail}
              onChange={(e) => setScheduleDetail(e.target.value)}
            />
            <CreateBtn onClick={handleSubmit}>일정 생성</CreateBtn>
          </ModalContainer>
        </TitleModal>
      )}
      {subOpen && (
        <TitleModal
          title="콘텐츠 추가"
          width={400}
          onClose={() => setSubOpen(false)}
        >
          <ModalContainer>
            <SubContentContainer>
              {subCates.map((el, index) => (
                <Label key={el.id}>
                  {el.name}
                  <RemoveButton onClick={() => handleRemoveSubCate(index)}>
                    x
                  </RemoveButton>
                </Label>
              ))}
            </SubContentContainer>
            <Dropdown
              options={categories}
              placeholder="상위 카테고리 선택"
              active={activeCate}
              onSelected={handleClickCate}
            />
            <Dropdown
              options={subCategories}
              placeholder={
                activeCate
                  ? "하위 카테고리 선택"
                  : "상위 카테고리를 선택해주세요."
              }
              onSelected={handleClickSub}
              active={activeSub}
            />
            <ModalTextArea
              placeholder="상세 내용을 입력해주세요."
              value={contentDetail}
              onChange={(e) => setContentDetail(e.target.value)}
            />
            <BtnContainer>
              <Btn onClick={handleAddSub}>추가</Btn>
              <Btn onClick={() => setSubOpen(false)}>완료</Btn>
            </BtnContainer>
          </ModalContainer>
        </TitleModal>
      )}
      {map && (
        <SearchMap
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onClose={handleMapClose}
          handleAddress={handleAddress}
        />
      )}
    </UserLayout>
  );
};

const ModalContainer = styled.div`
  width: 100%;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ContentContainer = styled.div`
  width: 320px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

const SubContentContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #e2e0ff;
  color: #4b3fcb;
  border-radius: 16px;
  font-size: 14px;
  height: 30px;
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #4b3fcb;
  font-size: 16px;
  cursor: pointer;
  height: 30px;
  width: 30px;

  &:hover {
    color: #2f29a8;
  }
`;

const AddLabelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  font-size: 20px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ModalTextArea = styled.textarea`
  all: unset;
  width: 95%;
  margin: 0 auto;
  resize: none;
  min-height: 100px;
  margin-top: 30px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid black;
`;

const CreateBtn = styled.div`
  width: 320px;
  height: 45px;
  cursor: pointer;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid black;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const BtnContainer = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
`;

const Btn = styled.div`
  width: 150px;
  height: 45px;
  margin: auto;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid black;
  margin-top: 5px;
`;

const SearchButton = styled.button`
  padding: 13px 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
