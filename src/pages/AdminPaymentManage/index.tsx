import styled from "styled-components";
import { AdminLayout } from "../../components/Layout/Admin";
import { FormControl, Modal } from "react-bootstrap";
import { useCancelPayment, useGetPayments } from "../../hooks/paymentApi";
import { useCallback, useEffect, useState } from "react";
import { PaymentData } from "./data";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import Button from "react-bootstrap/Button";
import { StyledTable, TableBody, TableHeader } from "../../components/StyledTable/tableStyle";


export const AdminPaymentManage = () => {
  const [getPointPay, getPointPayRes] = useGetPayments();
  const [getSubPay, getSubPayRes] = useGetPayments();
  const [cancelPay] = useCancelPayment();
  const [pointPage, setPointPage] = useState(1);
  const [subPage, setSubPage] = useState(1);
  const [pointTotalElements, setPointTotalElements] = useState(0);
  const [subTotalElements, setSubTotalElements] = useState(0);
  const [pointData, setPointData] = useState<PaymentData[]>([]);
  const [subscribeData, setSubscribeData] = useState<PaymentData[]>([]);
  const [open, setOpen] = useState(false);
  const [reqData, setReqData] = useState<{ paymentId: number | undefined, amount: number, reason: string }>(
    { paymentId: undefined, amount: 0, reason: "" });

  useEffect(() => {
    getPointPayData(pointPage, 10);
  }, [pointPage]);

  useEffect(() => {
    getSubPayData(subPage, 10);
  }, [subPage]);

  const getPointPayData = useCallback(
    (page: number, size: number) => {
      getPointPay("POINT", page, size).then(r => r);
    }, [getPointPay])

  const getSubPayData = useCallback(
    (page: number, size: number) => {
      getSubPay("SUBSCRIBE", page, size).then(r => r);
    }, [getSubPay])

  const cancelPayment = useCallback(
    (paymentId: number, amount: number, reason: string) => {
      cancelPay({ paymentId, amount, reason }).then(() =>
        alert("결제 취소 요청이 성공했습니다.")
      ).catch(() => alert("결제 취소 요청을 실패했습니다.")
      ).finally(() => {
        modalClose();
        window.location.reload();
      });
    }, [getSubPay])

  useEffect(() => {
    if (getPointPayRes.data) {
      setPointData(getPointPayRes.data.data.data);
      setPointPage(getPointPayRes.data.data.page);
      setPointTotalElements(getPointPayRes.data.data.totalElements);
    }
  }, [getPointPayRes]);

  useEffect(() => {
    if (getSubPayRes.data) {
      setSubscribeData(getSubPayRes.data.data.data);
      setSubTotalElements(getSubPayRes.data.data.totalElements);
      setSubPage(getSubPayRes.data.data.page);
    }
  }, [getSubPayRes]);

  const cancelClickHandler = (paymentId: number, amount: number) => {
    setOpen(true);
    setReqData((prev) => ({ ...prev, paymentId: paymentId, amount }));
  }

  const modalButtonControl = () => {
    if (reqData.paymentId !== undefined && reqData.amount !== 0 && reqData.reason !== "") {
      cancelPayment(reqData.paymentId, reqData.amount, reqData.reason);
    } else {
      alert("결제 취소에 실패했습니다.");
    }
  }

  const modalClose = useCallback(() => {
    setOpen(false);
    setReqData({ paymentId: undefined, amount: 0, reason: "" });
  }, [])

  return (
    <>
      <AdminLayout>
        <Wrapper>
          <Title>결제 내역 - 포인트</Title>
          <TableWrapper>
            <StyledTable>
              <TableHeader>
                <tr>
                  <th style={{ width: "50px" }}></th>
                  <th style={{ width: "120px" }}>타입</th>
                  <th style={{ width: "120px" }}>결제 상태</th>
                  <th style={{ width: "250px" }}>결제 ID</th>
                  <th style={{ width: "250px" }}>tId</th>
                  <th style={{ width: "250px" }}>결제 내용</th>
                  <th>결제 유저 이메일</th>
                  <th style={{ width: "120Px" }}>결제 금액</th>
                  <th style={{ width: "200px" }}>결제일</th>
                  <th style={{ width: "100px" }}>취소</th>
                </tr>
              </TableHeader>
              <TableBody>
                {
                  pointData.map((point: PaymentData, index) => {
                    return (
                      <tr key={index}>
                        <td className="centerAlign">{index + 1 + (10 * (pointPage - 1))}</td>
                        <td>{point.type}</td>
                        <td>{point.status}</td>
                        <td>{point.payUid}</td>
                        <td>{point.portoneUid}</td>
                        <td>{point.details}</td>
                        <td>{point.userEmail}</td>
                        <td>{point.amount.toLocaleString("ko-KR")} 원</td>
                        <td>{point.createdAt.toString().split(".")[0].replace("T", " ")}</td>
                        <td className="centerAlign">
                          <CancelBtn disabled={point.status !== "PAID"}
                                     onClick={() => cancelClickHandler(point.id, point.amount)}>취소</CancelBtn>
                        </td>
                      </tr>
                    )
                  })
                }
              </TableBody>
            </StyledTable>
          </TableWrapper>
          <PaginationContainer
            activePage={pointPage}
            itemsCountPerPage={10}
            totalItemsCount={pointTotalElements}
            pageRangeDisplayed={5}
            onPageChange={(page: number) => setPointPage(page)}
          />
          <Title>결제 내역 - 구독</Title>
          <TableWrapper>
            <StyledTable>
              <TableHeader>
                <tr>
                  <th style={{ width: "50px" }}></th>
                  <th style={{ width: "120px" }}>타입</th>
                  <th style={{ width: "120px" }}>결제 상태</th>
                  <th style={{ width: "250px" }}>결제 ID</th>
                  <th style={{ width: "250px" }}>tId</th>
                  <th style={{ width: "250px" }}>결제 내용</th>
                  <th>결제 유저 이메일</th>
                  <th style={{ width: "120px" }}>결제 금액</th>
                  <th style={{ width: "200px" }}>결제일</th>
                  <th style={{ width: "100px" }}>취소</th>
                </tr>
              </TableHeader>
              <TableBody>
                {
                  subscribeData.map((subscribe: PaymentData, index) => {
                    return (
                      <tr key={index}>
                        <td className="centerAlign">{index + 1 + (10 * (subPage - 1))}</td>
                        <td>{subscribe.type}</td>
                        <td>{subscribe.status}</td>
                        <td>{subscribe.payUid}</td>
                        <td>{subscribe.portoneUid}</td>
                        <td>{subscribe.details}</td>
                        <td>{subscribe.userEmail}</td>
                        <td>{subscribe.amount.toLocaleString("ko-KR")} 원</td>
                        <td>{subscribe.createdAt.toString().split(".")[0].replace("T", " ")}</td>
                        <td className="centerAlign">
                          <CancelBtn disabled={subscribe.status !== "PAID"}
                                     onClick={() => cancelClickHandler(subscribe.id, subscribe.amount)}>
                            취소</CancelBtn>
                        </td>
                      </tr>
                    )
                  })
                }
              </TableBody>
            </StyledTable>
          </TableWrapper>
          <PaginationContainer
            activePage={subPage}
            itemsCountPerPage={10}
            totalItemsCount={subTotalElements}
            pageRangeDisplayed={5}
            onPageChange={(page: number) => setSubPage(page)}
          />
        </Wrapper>
      </AdminLayout>
      <Modal show={open} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>취소 사유</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ paddingBottom: "10px" }}>취소 사유를 입력해 주세요.</div>
          <FormControl type="text" id="reasonText" onChange={(event) =>
            setReqData((prevState) => ({ ...prevState, reason: event.target.value }))} />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center", padding: "5px 10px" }}>
          <Button onClick={modalButtonControl} variant="danger" size="sm">취소하기</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  background-color: white;
  height: calc(100vh - 160px);
  padding: 20px;
  scrollbar-width: none;
  overflow: scroll;
  border: 1px solid black;
  border-radius: 10px;
`;

const TableWrapper = styled.div`
  height: calc(50% - 42px);
  overflow: scroll;
  scrollbar-width: none;
`

const Title = styled.div`
  font-size: 25px;
`;

const CancelBtn = styled.button`
  width: 70px;
  padding: 5px 10px;
  font-size: 15px;
  border: unset;
  background-color: var(--main-color);
  border-radius: 5px;
  overflow: hidden;
  
  &:active, &:hover {
    background-color: var(--button-active-color);
    color: #fff;
  }
`