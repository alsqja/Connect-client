import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ISchedule } from "./data";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { useGetAllSchedules, useDeleteSchedule } from "../../hooks/scheduleApi";

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

  if (schedules.length === 0) {
    return (
      <TableWrapper>
        <div style={{ width: "100%", padding: "150px 0", textAlign: "center" }}>
          일정이 없습니다.
        </div>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <TableHeader>
          <tr>
            <th>No</th>
            <th>날짜</th>
            <th>제목</th>
            <th>상세 내용</th>
            <th>컨텐츠</th>
            <th>생성일</th>
            <th>수정일</th>
            <th>작업</th>
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
              <td>{new Date(schedule.createdAt).toLocaleString()}</td>
              <td>{new Date(schedule.updatedAt).toLocaleString()}</td>
              <td>
                <DeleteButton onClick={() => handleDelete(schedule.id)}>
                  삭제
                </DeleteButton>
              </td>
            </tr>
          ))}
        </TableBody>
      </StyledTable>
      {totalElements > 10 && (
        <PaginationContainer
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalElements}
          pageRangeDisplayed={5}
          onPageChange={(page: number) => setPage(page)}
        />
      )}
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
  overflow-x: auto;
  background-color: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.thead`
  background-color: #f4f4f4;

  th {
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #ddd;
  }

  th:nth-child(4) {
    min-width: 250px;
  }

  th:nth-child(6) {
    width: 200px;
  }
  th:nth-child(7) {
    width: 200px;
  }
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
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
