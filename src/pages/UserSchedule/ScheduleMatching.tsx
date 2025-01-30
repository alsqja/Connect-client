import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ICreatedMatching, ISchedule, IScheduleMatching } from "./data";
import { useRecoilValue } from "recoil";
import { userState } from "../../stores/session";
import { useGetScheduleMatching } from "../../hooks/scheduleApi";
import { useUpdateMatching } from "../../hooks/matchingApi";
import { MatchingModal } from "./MatchingModal";
import { ScheduleModal } from "./ScheduleModal";
import { ReportModal } from "./ReportModal";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { FilterModal } from "./FilterModal";

interface IProps {
  id: number;
  handleSubmit: (data: any) => void;
  postMatchingRes: any;
  schedule: ISchedule;
}
export const ScheduleMatching = ({
  id,
  handleSubmit,
  schedule,
  postMatchingRes,
}: IProps) => {
  const [successData, setSuccessData] = useState<IScheduleMatching[]>([]);
  const [sentData, setSentData] = useState<IScheduleMatching[]>([]);
  const [receivedData, setReceivedData] = useState<IScheduleMatching[]>([]);
  const user = useRecoilValue(userState);
  const [getReq, getRes] = useGetScheduleMatching();
  const [updateReq, updateRes] = useUpdateMatching();
  const [modal, setModal] = useState(false);
  const [matching, setMatching] = useState<ICreatedMatching>();
  const [detailModal, setDetailModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportUserId, setReportUserId] = useState(0);
  const [reportMatchingId, setReportMatchingId] = useState(0);
  const navigate = useNavigate();
  const isMember = user?.memberType !== null;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [gender, setGender] = useState<string>("랜덤");
  const [distance, setDistance] = useState<number>(5);
  const [minAge, setMinAge] = useState<number>(-5);
  const [maxAge, setMaxAge] = useState<number>(10);

  useEffect(() => {
    getReq(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setSuccessData(
        getRes.data.data.filter(
          (el: IScheduleMatching) => el.matchStatus === "ACCEPTED"
        )
      );
      setSentData(
        getRes.data.data.filter(
          (el: IScheduleMatching) =>
            el.matchStatus === "PENDING" && el.fromUserId === user?.id
        )
      );
      setReceivedData(
        getRes.data.data.filter(
          (el: IScheduleMatching) =>
            el.matchStatus === "PENDING" && el.toUserId === user?.id
        )
      );
    }
  }, [getRes, user?.id]);

  const handleUpdate = useCallback(
    (id: number, status: string) => {
      updateReq(id, status);
    },
    [updateReq]
  );

  useEffect(() => {
    if (updateRes.data && updateRes.called) {
      window.location.reload();
    }
  }, [updateRes]);

  useEffect(() => {
    if (postMatchingRes.called && postMatchingRes.error) {
      if (postMatchingRes.error.includes("없는 데이터"))
        alert("반경 10KM 내 일정이 없습니다.");
      if (postMatchingRes.error.includes("포인트"))
        alert("포인트가 부족합니다.");
      return;
    }

    if (postMatchingRes.called && postMatchingRes.data) {
      setModal(true);
      setMatching(postMatchingRes.data.data);
    }
  }, [postMatchingRes]);

  const handleNavigate = useCallback(
    (id: number) => {
      navigate(`/user/${id}/feed`);
    },
    [navigate]
  );

  const handleCreateMatching = useCallback(() => {
    let dataGender = null;
    if (gender === "남") {
      dataGender = "MAN";
    } else if (gender === "여") {
      dataGender = "WOMAN";
    }
    handleSubmit({
      gender: dataGender,
      minusAge: -minAge,
      plusAge: maxAge,
      distance: distance,
    });
  }, [distance, gender, handleSubmit, maxAge, minAge]);

  return (
    <Container>
      <Section>
        <Title>
          매칭 성공 내역
          <Description>
            유사도는 선택하신 콘텐츠와 상위 카테고리를 기준으로 측정됩니다.
          </Description>
        </Title>
        <ScrollableContainer>
          {successData.length > 0 ? (
            successData.map((item) => (
              <Item key={item.id}>
                <Info>
                  <Name
                    onClick={() =>
                      handleNavigate(
                        user?.id === item.fromUserId
                          ? item.toUserId
                          : item.fromUserId
                      )
                    }
                  >
                    {user?.id === item.fromUserId
                      ? item.toUserName
                      : item.fromUserName}
                  </Name>
                  님과의 유사도 {(item.similarity * 100).toFixed(2)}% 입니다.
                </Info>
                <ProgressWrapper>
                  <ProgressBar value={Math.floor(item.similarity * 100)} />
                  <Range>
                    <span>0</span>
                    <span>100</span>
                  </Range>
                </ProgressWrapper>
                <Action
                  onClick={() => {
                    setReportModal(true);
                    setReportUserId(
                      user?.id === item.fromUserId
                        ? item.toUserId
                        : item.fromUserId
                    );
                    setReportMatchingId(item.id);
                  }}
                >
                  신고
                </Action>
              </Item>
            ))
          ) : (
            <div>매칭 성공 내역이 없습니다.</div>
          )}
        </ScrollableContainer>
      </Section>
      <Section>
        <Title>받은 신청</Title>
        <ScrollableContainer>
          {receivedData.length > 0 ? (
            receivedData.map((item) => (
              <Item key={item.id}>
                <Info>
                  <Name onClick={() => handleNavigate(item.fromUserId)}>
                    {item.fromUserName}
                  </Name>
                  님과의 유사도 {(item.similarity * 100).toFixed(2)}% 입니다.
                </Info>
                <ProgressWrapper>
                  <ProgressBar value={Math.floor(item.similarity * 100)} />
                  <Range>
                    <span>0</span>
                    <span>100</span>
                  </Range>
                </ProgressWrapper>
                <Action onClick={() => handleUpdate(item.id, "ACCEPTED")}>
                  수락
                </Action>
                <Action>/</Action>
                <Action onClick={() => handleUpdate(item.id, "REJECTED")}>
                  거절
                </Action>
              </Item>
            ))
          ) : (
            <div>받은 요청이 없습니다.</div>
          )}
        </ScrollableContainer>
      </Section>
      <Section>
        <Title>보낸 신청</Title>
        <ScrollableContainer>
          {sentData.length > 0 ? (
            sentData.map((item) => (
              <Item key={item.id}>
                <Info>
                  <Name onClick={() => handleNavigate(item.toUserId)}>
                    {item.toUserName}
                  </Name>
                  님과의 유사도 {(item.similarity * 100).toFixed(2)}% 입니다.
                </Info>
                <ProgressWrapper>
                  <ProgressBar value={Math.floor(item.similarity * 100)} />
                  <Range>
                    <span>0</span>
                    <span>100</span>
                  </Range>
                </ProgressWrapper>
                <Action onClick={() => handleUpdate(item.id, "REJECTED")}>
                  요청 취소
                </Action>
              </Item>
            ))
          ) : (
            <div>신청 내역이 없습니다.</div>
          )}
        </ScrollableContainer>
      </Section>
      <ButtonContainer>
        <MatchButton onClick={handleCreateMatching}>
          {`매칭 찾기 ${
            5 - schedule.count > 0 ? `무료 ${5 - schedule.count}회` : "(50P)"
          }`}
        </MatchButton>
        <FilterButton onClick={() => setIsFilterModalOpen(true)}>
          <FaFilter size={18} />
        </FilterButton>
      </ButtonContainer>
      {isFilterModalOpen && (
        <FilterModal
          onClose={() => setIsFilterModalOpen(false)}
          gender={gender}
          setGender={setGender}
          distance={distance}
          setDistance={setDistance}
          minAge={minAge}
          setMinAge={setMinAge}
          maxAge={maxAge}
          setMaxAge={setMaxAge}
          isMember={isMember}
        />
      )}
      {modal && (
        <MatchingModal
          onClose={() => {
            if (
              window.confirm(
                "창을 닫으면 매칭을 신청 할 수 없습니다. 그래도 닫으시겠습니까?"
              )
            )
              matching && handleUpdate(matching?.id, "REJECTED");
          }}
          data={matching}
          onViewDetails={() => setDetailModal(true)}
        />
      )}
      {detailModal && (
        <ScheduleModal
          onClose={() => setDetailModal(false)}
          id={matching?.toScheduleId}
          handleSubmit={() => matching && handleUpdate(matching?.id, "PENDING")}
        />
      )}
      {reportModal && (
        <ReportModal
          onClose={() => setReportModal(false)}
          matchingId={reportMatchingId}
          toId={reportUserId}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin-left: 100px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
`;

const Description = styled.span`
  font-size: 12px;
  color: #888;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`;

const ScrollableContainer = styled.div`
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
  scrollbar-width: none;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Info = styled.div`
  flex: 1;
  font-size: 14px;
`;

const Name = styled.span`
  font-weight: bold;
  color: #4b3fcb;
  cursor: pointer;
`;

const ProgressWrapper = styled.div`
  flex: 1;
  margin: 0 20px;
`;

const ProgressBar = styled.div<{ value: number }>`
  width: 100%;
  height: 8px;
  background-color: #e6e6e6;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    width: ${({ value }) => `${value}%`};
    height: 100%;
    background-color: #9c88ff;
    transition: width 0.3s ease-in-out;
  }
`;

const Range = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 4px;
`;

const Action = styled.div`
  font-size: 14px;
  color: #888;
  cursor: pointer;

  &:hover {
    color: #555;
    text-decoration: underline;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MatchButton = styled.button`
  /* width: 150px; */
  flex: 1;
  padding: 12px 0;
  font-size: 16px;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  padding: 8px;
  border-radius: 50%;
  transition: 0.3s ease;

  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
  }
`;
