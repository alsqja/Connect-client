import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ISchedule } from "./data";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { useDeleteSchedule, useGetAllSchedules } from "../../hooks/scheduleApi";
import {
  StyledTable,
  TableBody,
  TableHeader,
  TableWrapper,
} from "../../components/StyledTable/tableStyle";

export const ScheduleTable = () => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [getReq, getRes] = useGetAllSchedules();
  const [deleteReq, deleteRes] = useDeleteSchedule();

  useEffect(() => {
    getReq(page, 10, null);
  }, [page]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setSchedules(getRes.data.data.data);
      setTotalElements(getRes.data.data.totalElements);
    }
  }, [getRes]);

  useEffect(() => {
    if (!deleteRes.error && deleteRes.called) {
      alert("삭제가 완료되었습니다.");
      getReq(page, 10, null); // 삭제 후 테이블 갱신
    }
  }, [deleteRes, getReq, page]);

  const handleDelete = (id: number) => {
    if (window.confirm("일정을 삭제하시겠습니까?")) {
      deleteReq(id);
    }
  };

  return (
    <>
      <Title>일정 내역</Title>
      {schedules.length > 0 ? (
        <>
          <TableWrapper>
            <StyledTable>
              <TableHeader>
                <tr>
                  <th style={{ width: "50px" }}>No</th>
                  <th style={{ width: "150px" }}>날짜</th>
                  <th style={{ width: "150px" }}>제목</th>
                  <th style={{ width: "250px" }}>상세 내용</th>
                  <th style={{ width: "150px" }}>컨텐츠</th>
                  <th style={{ width: "150px" }}>생성일</th>
                  <th style={{ width: "150px" }}>수정일</th>
                  <th style={{ width: "150px" }}>작업</th>
                </tr>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule, index) => (
                  <tr key={schedule.id}>
                    <td>{10 * (page - 1) + index + 1}</td>
                    <td>{schedule.date}</td>
                    <td>{schedule.title}</td>
                    <td>{schedule.details}</td>
                    <td>
                      {schedule.contentNames.length > 1
                        ? schedule.contentNames[0] +
                          " 외 " +
                          (schedule.contentNames.length - 1)
                        : schedule.contentNames[0]}
                    </td>
                    <td>
                      {schedule.createdAt
                        .toString()
                        .split(".")[0]
                        .replace("T", " ")}
                    </td>
                    <td>
                      {schedule.updatedAt
                        .toString()
                        .split(".")[0]
                        .replace("T", " ")}
                    </td>
                    <td>
                      <DeleteButton onClick={() => handleDelete(schedule.id)}>
                        삭제
                      </DeleteButton>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </StyledTable>
          </TableWrapper>
          <PaginationContainer
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={totalElements}
            pageRangeDisplayed={5}
            onPageChange={(page: number) => setPage(page)}
          />
        </>
      ) : (
        <>일정 내역이 없습니다.</>
      )}
    </>
  );
};

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;

const DeleteButton = styled.button`
  padding: 5px 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d9363e;
  }
`;
