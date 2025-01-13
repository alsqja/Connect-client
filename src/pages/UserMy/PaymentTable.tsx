import { useGetPayments } from "../../hooks/paymentApi";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { PaymentData } from "../AdminPaymentManage/data";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { StyledTable, TableBody, TableHeader, TableWrapper } from "../../components/StyledTable/tableStyle";

export const PaymentTable = () => {
  const [getPayReq, getPayRes] = useGetPayments();
  const [paymentsData, setPaymentsData] = useState<PaymentData[]>([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    getPayments(page, 10);
  }, [page]);

  const getPayments = useCallback((page: number, size: number) => {
    getPayReq(undefined, page, size).then(r => r);
  }, [getPayReq]);

  useEffect(() => {
    if (getPayRes.data) {
      setPaymentsData(getPayRes.data.data.data);
      setPage(getPayRes.data.data.page);
      setTotalElements(getPayRes.data.data.totalElements);
    }
  }, [getPayRes]);

  return (
    <>
      <Title>결제 정보</Title>
      <TableWrapper>
        <StyledTable>
          <TableHeader>
            <tr>
              <th style={{ width: "50px" }}></th>
              <th style={{ width: "120px" }}>타입</th>
              <th style={{ width: "120px" }}>결제 상태</th>
              <th style={{ width: "250px" }}>결제 ID</th>
              <th style={{ width: "250px" }}>결제 내용</th>
              <th style={{ width: "120px" }}>결제 금액</th>
              <th style={{ width: "200px" }}>결제일</th>
            </tr>
          </TableHeader>
          <TableBody>
            {paymentsData.map((payment: PaymentData, index: number) => {
              return (
                <tr key={index}>
                  <td className="centerAlign">{index + 1 + (10 * (page - 1))}</td>
                  <td>{payment.type}</td>
                  <td>{payment.status}</td>
                  <td>{payment.payUid}</td>
                  <td>{payment.details}</td>
                  <td>{payment.amount.toLocaleString("ko-KR")}</td>
                  <td>{payment.createdAt.toString().split(".")[0].replace("T", " ")}</td>
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
    </>
  );
}

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;
