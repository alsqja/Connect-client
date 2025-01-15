import styled from "styled-components";

import {
  StyledTable,
  TableBody,
  TableHeader,
  TableWrapper,
} from "../../components/StyledTable/tableStyle";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { useCallback, useEffect, useState } from "react";
import { IReportListData } from "./data";
import { useDeleteReport, useGetUserReport } from "../../hooks/reportApi";

export const ReportTable = () => {
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [reports, setReports] = useState<IReportListData[]>([]);
  const [getReq, getRes] = useGetUserReport();
  const [deleteReq, deleteRes] = useDeleteReport();

  useEffect(() => {
    getReq(page, 10);
  }, [page]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setReports(getRes.data.data.data);
      setTotalElements(getRes.data.data.totalElements);
    }
  }, [getRes]);

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm("신고를 취소하시겠습니까?")) deleteReq(id);
    },
    [deleteReq]
  );

  useEffect(() => {
    if (deleteRes.called && !deleteRes.error && !deleteRes.loading) {
      alert("신고가 취소되었습니다.");
      getReq(page, 10);
      return;
    }
  }, [deleteRes]);

  return (
    <>
      <Title>신고 내역</Title>
      {reports.length > 0 ? (
        <>
          <TableWrapper>
            <StyledTable>
              <TableHeader>
                <tr>
                  <th style={{ width: "50px" }}>NO</th>
                  <th style={{ width: "200px" }}>일정</th>
                  <th style={{ width: "120px" }}>유저</th>
                  <th style={{ width: "300px" }}>사유</th>
                  <th style={{ width: "120px" }}>날짜</th>
                  <th style={{ width: "120px" }}>신고 날짜</th>
                  <th style={{ width: "120px" }}>취소</th>
                </tr>
              </TableHeader>
              <TableBody>
                {reports.map((el: IReportListData, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="centerAlign">
                        {index + 1 + 10 * (page - 1)}
                      </td>
                      <td>{el.scheduleTitle}</td>
                      <td>{el.toName}</td>
                      <td>{el.content}</td>
                      <td>{el.scheduleDate}</td>
                      <td>
                        {el.createdAt
                          .toString()
                          .split(".")[0]
                          .replace("T", " ")}
                      </td>
                      <td>
                        <DeleteButton onClick={() => handleDelete(el.id)}>
                          취소
                        </DeleteButton>
                      </td>
                    </tr>
                  );
                })}
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
        <>신고 내역이 없습니다.</>
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
