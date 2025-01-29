import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { AdminCouponRes } from "./data";
import { OverflowTd, TableBody, TableWrapper } from "../../components/StyledTable/tableStyle";
import { StyledTable, TableHeader } from "../AdminUser/UserTable";
import MainColorButton from "../../components/Button/MainColorButton";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { useNavigate } from "react-router-dom";
import { useGetCoupons } from "../../hooks/couponApi";

export const AdminCoupon = () => {
  const [getCoupon, getCouponRes] = useGetCoupons();
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [coupon, setCoupon] = useState<AdminCouponRes[]>([]);
  const navigate = useNavigate();

  const getCouponData = useCallback((page: number, size: number) => {
    getCoupon(page, size);
  }, [getCoupon])

  useEffect(() => {
    getCouponData(page, 10);
  }, [page]);

  useEffect(() => {
    if (getCouponRes.data) {
      setCoupon(getCouponRes.data.data.data);
      setPage(getCouponRes.data.data.page);
      setTotalElements(getCouponRes.data.data.totalElements);
    }
  }, [getCouponRes]);

  const statusString = (isDeleted: boolean, openDate: string) => {
    const now = new Date().getTime();
    const open = new Date(openDate).getTime();

    if (now < open) {
      return "미배포";
    } else {
      if (!isDeleted) {
        return "배포중";
      } else {
        return "배포완료"
      }
    }
  }

  return (
    <>
      <Wrapper>
        <div>
          <Title>쿠폰 생성</Title>
          <TableWrapper>
            <StyledTable style={{ tableLayout: "fixed" }}>
              <TableHeader>
                <tr>
                  <th style={{ width: "50px" }}>NO</th>
                  <th style={{ width: "100px" }}>쿠폰 상태</th>
                  <th style={{ width: "280px" }}>쿠폰 제목</th>
                  <th style={{ width: "280px" }}>쿠폰 내용</th>
                  <th style={{ width: "180px" }}>쿠폰 오픈일</th>
                  <th style={{ width: "130px" }}>쿠폰 만료일</th>
                  <th style={{ width: "180px" }}>쿠폰 생성일</th>
                  <th style={{ width: "180px" }}>쿠폰 수정일</th>
                  <th style={{ width: "80px" }}>수정</th>
                </tr>
              </TableHeader>
              <TableBody>
                {coupon.map((data: AdminCouponRes, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1 + (10 * (page - 1))}</td>
                      <td>{statusString(data.isDeleted, data.openDate)}</td>
                      <OverflowTd>{data.name}</OverflowTd>
                      <OverflowTd>{data.description}</OverflowTd>
                      <td>{data.openDate.replace("T", " ")}</td>
                      <td>{data.expiredDate}</td>
                      <td>{data.createdAt.replace("T", " ").split(".")[0]}</td>
                      <td>{data.updatedAt.replace("T", " ").split(".")[0]}</td>
                      <td><MainColorButton onClick={() => {
                        navigate(`/admin/coupon/${data.id}`)
                      }}>수정</MainColorButton></td>
                    </tr>
                  )
                })}
              </TableBody>
            </StyledTable>
          </TableWrapper>
          <PaginationContainer
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={totalElements}
            pageRangeDisplayed={5}
            onPageChange={setPage}
          />
        </div>
        <NewCoupon>
          <MainColorButton onClick={() => {
            navigate(`/admin/coupon/new`)
          }}>쿠폰 신규 생성</MainColorButton>
        </NewCoupon>
      </Wrapper>
    </>);
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  background-color: white;
  height: calc(100vh - 160px);
  padding: 20px;
  overflow: scroll;
  scrollbar-width: none;
  border: 1px solid black;
  border-radius: 10px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
  width: 300px;
`;

const NewCoupon = styled.div`
  display: flex;
  justify-content: end;
  
  button {
    width: 150px;
  }
`