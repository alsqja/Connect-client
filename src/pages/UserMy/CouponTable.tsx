import { OverflowTd, StyledTable, TableHeader, TableWrapper } from "../../components/StyledTable/tableStyle";
import styled from "styled-components";
import { useGetUserCoupons } from "../../hooks/userApi";
import { useCallback, useEffect, useState } from "react";
import { CouponStatus, GetCouponData } from "./data";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { TableBody } from "../AdminUser/UserTable";
import { format, subDays } from "date-fns";

export const CouponTable = () => {
  const [getCouponReq, getCouponRes] = useGetUserCoupons();
  const [couponDate, setCouponDate] = useState<GetCouponData[]>([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const getCouponData = useCallback((page: number, size: number, status: CouponStatus) => {
    getCouponReq(page, size, status).then((r) => r);
  }, [getCouponReq]);

  useEffect(() => {
    getCouponData(page, 10, "ALL");
  }, [page]);

  useEffect(() => {
    if (getCouponRes.data) {
      setCouponDate(getCouponRes.data.data.data);
      setPage(getCouponRes.data.data.page);
      setTotalElements(getCouponRes.data.data.totalElements);
    }
  }, [getCouponRes]);

  return (
    <>
      <Title>쿠폰 내역</Title>
      <TableWrapper>
        <StyledTable style={{ tableLayout: "fixed" }}>
          <TableHeader>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              <th style={{ width: "80px" }}>쿠폰 상태</th>
              <th style={{ width: "250px" }}>쿠폰 이름</th>
              <th style={{ width: "250px" }}>쿠폰 내용</th>
              <th style={{ width: "80px" }}>무료 횟수</th>
              <th style={{ width: "80px" }}>쿠폰 만료일</th>
              <th style={{ width: "130px" }}>쿠폰 발급일</th>
            </tr>
          </TableHeader>
          <TableBody>
            {couponDate.map((item, index) => {
                const date = new Date(item.expiredDate);
                return (
                  <tr key={index}>
                    <td>{index + 1 + (10 * (page - 1))}</td>
                    <td>{item.status === "USED" ? "사용 완료" : "미사용"}</td>
                    <OverflowTd>{item.couponName}</OverflowTd>
                    <OverflowTd>{item.couponDescription}</OverflowTd>
                    <td>{item.amount} 회</td>
                    <td>{format(subDays(date, 1), "yyyy-MM-dd")}</td>
                    <td>{item.createdAt.split(".")[0].replace("T", " ")}</td>
                  </tr>
                )
              }
            )}
          </TableBody>
        </StyledTable>
        <PaginationContainer
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalElements}
          pageRangeDisplayed={5}
          onPageChange={setPage} />
      </TableWrapper>
    </>

  )
}

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;