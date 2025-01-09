import { useCallback, useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import { PaymentRequestType, usePostPayments } from "../../hooks/paymentApi";

export const PointPage = () => {
  const [chargePoint, setChargePoint] = useState(0);
  const [payReq] = usePostPayments();
  const pointImg = ["P1", "P2", "P3", "P4", "P5", "P6"];

  const paymentTest = useCallback((body: PaymentRequestType) => {
    payReq(body);
  }, [payReq])

  const payModule = async () => {
    const paymentUid = "pay-" + crypto.randomUUID().toString().substring(0, 16);
    const storeId = process.env.REACT_APP_STORE_ID;
    const channelId = process.env.REACT_APP_CHANNEL_ID;

    if (storeId !== undefined && channelId !== undefined) {
      await PortOne.requestPayment({
        storeId: storeId,
        channelKey: channelId,
        paymentId: paymentUid,
        orderName: "포인트 충전 : " + chargePoint + " 원",
        totalAmount: chargePoint,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
      }).then((result) => {
        if (result?.code === undefined && result?.txId !== undefined) {
          const body: PaymentRequestType = {
            payUid: result.paymentId,
            portoneUid: result.txId,
            amount: chargePoint,
            details: chargePoint + "원이 충전되었습니다.( " + chargePoint / 10 + " P )",
            type: "POINT",
            status: "PAID",
          }

          paymentTest(body);
        }
      });
    }
  }

  const PointCards = (url: string, index: number) => {
    return (
      <PointCard key={index} className={chargePoint / 1000 - 1 === index ? "active" : "normal"}
                 onClick={() => setChargePoint((index + 1) * 1000)}>
        <img src={require(`../../assets/images/${url}.png`)}/>
        <div>
          {((index + 1) * 100).toLocaleString('ko-KR')} P
        </div>
        <div>
          {((index + 1) * 1000).toLocaleString('ko-KR')} 원
        </div>
      </PointCard>
    )
  }

  return (
    <>
      <Title>포인트 충전</Title>
      <Container>
        <CardReplace>
          {pointImg.map((url, index) => {
            return (PointCards(url, index));
          })}
        </CardReplace>
        <NoticePoint>
          <div className="point">충전 포인트 {(chargePoint / 10).toLocaleString('ko-KR')} 포인트</div>
          <div className="won">{chargePoint.toLocaleString('ko-KR')}원이 결제 됩니다.</div>
        </NoticePoint>
        <Button variant="outline-dark" onClick={payModule}>포인트 충전</Button>
      </Container>
    </>
  );
};

const Container = styled.div`
    padding: 20px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    border-radius: 10px;
    background-color: white;
`;

const Title = styled.div`
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`

const CardReplace = styled.div`
    display: flex;
    width: 500px;
    flex-wrap: wrap;
    justify-content: center;
`

const PointCard = styled.div`
    border: 1px solid black;
    border-radius: 5px;
    padding: 8px 5px;
    cursor: pointer;
    margin: 10px;
    text-align: center;
    font-size: 12px;

    img {
        width: 100px;
        height: 100px;
        margin-bottom: 8px;
    }

    &:not(.active):hover {
        box-shadow: inset 2px 2px 8px #828282;
    }

    background-color: ${(props) => props.className === "active" ? "rgba(212, 206, 255, 0.5)" : "#FFFFFF"};
    box-shadow: ${(props) => props.className === "active" ? "inset 2px 2px 4px #A9A1FF" : "unset"};
`

const NoticePoint = styled.div`
    width: 100%;
    height: 100%;
    text-align: end;
    align-content: end;
    margin-right: 20px;

    & .point {
        font-size: 12px;
        color: #828282;
    }
`