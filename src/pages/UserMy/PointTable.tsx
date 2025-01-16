import { useCallback, useEffect, useState } from "react";
import { useGetAllPoint } from "../../hooks/pointApi";
import { GetPointData } from "./data";
import styled from "styled-components";
import { StyledTable, TableBody, TableHeader, TableWrapper } from "../../components/StyledTable/tableStyle";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";


export const PointTable = () => {
  const [getPointReq, getPointRes] = useGetAllPoint();
  const [pointData, setPointData] = useState<GetPointData[]>([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const PointType = {
    "CHARGE": "충전",
    "USE": "사용",
    "CHANGE": "전환",
    "REFUND": "환불"
  }

  useEffect(() => {
    getPoint(page, 10);
  }, [page]);

  const getPoint = useCallback((page: number, size: number) => {
    getPointReq(page, size).then(r => r);
  }, [getPointReq])

  useEffect(() => {
    if (getPointRes.data) {
      setPointData(getPointRes.data.data.data);
      setPage(getPointRes.data.data.page);
      setTotalElements(getPointRes.data.data.totalElements);
    }
  }, [getPointRes]);

  return (<>
    <Title>포인트 내역</Title>
    <TableWrapper>
      <StyledTable>
        <TableHeader>
          <tr>
            <th style={{ width: "50px" }}></th>
            <th style={{ width: "120px" }}>타입</th>
            <th>사용 내용</th>
            <th style={{ width: "100px" }}>사용/충전 포인트</th>
            <th style={{ width: "200px" }}>사용일</th>
          </tr>
        </TableHeader>
        <TableBody>
          {pointData.map((point: GetPointData, index: number) => {
            return (
              <tr key={index}>
                <td>{index + 1 + (10 * (page - 1))}</td>
                <td>{PointType[point.pointUseType]}</td>
                <td>{point.details}</td>
                <td>{point.amount === 0 ? "+" + point.pointChange.toLocaleString("ko-KR") : "-" + point.amount.toLocaleString("ko-KR")} P</td>
                <td>{point.createdAt.toString().split(".")[0].replace("T", " ")}</td>
              </tr>
            )
          })}
        </TableBody>
      </StyledTable>
      <PaginationContainer
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={totalElements}
        pageRangeDisplayed={5}
        onPageChange={(page: number) => setPage(page)}
      />
    </TableWrapper>
  </>)
}


const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;