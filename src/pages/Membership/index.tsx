import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import logo from "../../assets/images/logo.png"
import Button from "react-bootstrap/Button";
import xmark from "../../assets/images/square-xmark-solid.svg"
import okmark from "../../assets/images/square-check-solid.svg"
import { Modal } from "react-bootstrap";
import { TextField } from "../../components/TextField";
import { useMembershipPayment } from "../../hooks/paymentApi";
import { EncryptData, MembershipRequest } from "./data";
import { encryptAES } from "../../utils/CryptoUtil";
import { useNavigate } from "react-router-dom";

export const Membership = () => {
  const [postMembership] = useMembershipPayment();
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [birth, setBirth] = useState("");
  const [expiredYear, setExpiredYear] = useState("");
  const [expiredMonth, setExpiredMonth] = useState("");
  const [cardPassword, setCardPassword] = useState("");
  const navigate = useNavigate();

  const MembershipModalHandler = (amount: number) => {
    setOpen(true);
    setAmount(amount);
  }

  const postMembershipData = useCallback((data: EncryptData) => {
    postMembership(data).then((response) => {
      alert("멤버십 결제가 성공했습니다.\n이전 페이지로 돌아갑니다.");
      navigate(-1);
    }).catch(() => alert("결제에 실패했습니다.\n다시 시도해 주세요."));
  }, [postMembership])


  const PaymentButtonHandler = async () => {
    const paymentUid = "pay-" + crypto.randomUUID().toString().substring(0, 16);
    let membershipData = undefined;

    if (amount === 4900) {
      membershipData = "NORMAL";
    } else if (amount === 9900) {
      membershipData = "PREMIUM";
    }

    if (membershipData !== undefined) {
      const membershipRequestData: MembershipRequest = {
        amount: amount,
        details: `멤버십 ${membershipData}등급 신청 ( ${amount}원 결제 )`,
        type: "SUBSCRIBE",
        status: "PAID",
        payUid: paymentUid,
        cardNumber: cardNum.replaceAll("-", ""),
        expiredYear: expiredYear,
        expiredMonth: expiredMonth,
        cardPassword: cardPassword,
        birth: birth,
      };

      const encryptData: EncryptData = {
        encryptData: encryptAES(JSON.stringify(membershipRequestData)).toString(),
      }

      postMembershipData(encryptData);
    }
  }


  const formatCardNumber = (input: string) => {
    const numericValue = input.replace(/\D/g, "");
    const limitedValue = numericValue.slice(0, 16);

    return limitedValue.match(/.{1,4}/g)?.join("-") || "";
  };

  useEffect(() => {
    setCardNum((prev) => formatCardNumber(prev));
  }, [cardNum]);

  return (
    <>
      <Wrapper>
        <div>
          <img src={logo} />
          <Title>Membership</Title>
        </div>
        <Divider style={{ margin: "30px" }} />
        <MembershipContainer>
          <MembershipCard>
            <MembershipTitle>기본</MembershipTitle>
            <div className="amount">무료</div>
            <Divider />
            <MembershipDescription>
              <div><img src={okmark} /> 매칭 5회 무료</div>
              <div><img src={xmark} /> 매칭 거리 선택</div>
              <div><img src={xmark} /> 매칭 상대 성별 선택</div>
              <div><img src={xmark} /> 매칭 상대 나이 선택</div>
              <div><img src={xmark} /> 매칭 상대 피드 보기</div>
              <div><img src={xmark} /> 매칭 상대 프로필 보기</div>
            </MembershipDescription>
            <Divider />
            <Button variant="secondary" disabled>신청</Button>
          </MembershipCard>
          <MembershipCard>
            <MembershipTitle>NORMAL</MembershipTitle>
            <div className="amount">4,900 원 / 월</div>
            <Divider />
            <MembershipDescription>
              <div><img src={okmark} /> 매칭 5회 무료</div>
              <div><img src={okmark} /> 매칭 거리 선택</div>
              <div><img src={okmark} /> 매칭 상대 성별 선택</div>
              <div><img src={okmark} /> 매칭 상대 나이 선택</div>
              <div><img src={xmark} /> 매칭 상대 피드 보기</div>
              <div><img src={xmark} /> 매칭 상대 프로필 보기</div>
            </MembershipDescription>
            <Divider />
            <Button onClick={() => MembershipModalHandler(4900)}>신청</Button>
          </MembershipCard>
          <MembershipCard>
            <MembershipTitle>PREMIUM</MembershipTitle>
            <div className="amount">9,900 원 / 월</div>
            <Divider />
            <MembershipDescription>
              <div><img src={okmark} /> 매칭 횟수 무제한</div>
              <div><img src={okmark} /> 매칭 거리 선택</div>
              <div><img src={okmark} /> 매칭 상대 성별 선택</div>
              <div><img src={okmark} /> 매칭 상대 나이 선택</div>
              <div><img src={okmark} /> 매칭 상대 피드 보기</div>
              <div><img src={okmark} /> 매칭 상대 프로필 보기</div>
            </MembershipDescription>
            <Divider />
            <Button onClick={() => MembershipModalHandler(9900)}>신청</Button>
          </MembershipCard>
        </MembershipContainer>
        <ModalContainer show={open} onHide={() => setOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>자동 결제 등록</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="notice">* 멤버쉽 결제는 멤버쉽이 종료되는 일자에 자동 결제 됩니다.</div>
              <TextField width={500} title="카드 번호" value={cardNum} onChange={setCardNum} />
              <TextField width={500} title="생년월일 6자리(또는 사업자 등록번호 10자리)" value={birth} onChange={setBirth} />
              <div className="expired">
                <TextField width={240} title="유효기간(연)" value={expiredYear} onChange={setExpiredYear} />
                <TextField width={240} title="유효기간(월)" value={expiredMonth} onChange={setExpiredMonth} />
              </div>
              <TextField width={500} title="카드 비밀번호 앞 두자리" value={cardPassword} onChange={setCardPassword} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => PaymentButtonHandler()}>결제</Button>
          </Modal.Footer>
        </ModalContainer>
      </Wrapper>
    </>
  )
}

const ModalContainer = styled(Modal)`
  .modal-dialog {
    justify-items: center;
  }
  
  .modal-content {
    width: 700px;
  }
  
  .modal-body {
    padding: 20px 30px;
    justify-items: center;
    
    .expired {
      display: flex;
      flex-direction: row;
      
      :first-child {
        margin-right: 20px;
      }
    }
  }
  
  .modal-footer {
    justify-content: center;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 95%;
  background-color: white;
  height: calc(100vh - 160px);
  padding: 15px 30px 20px;
  scrollbar-width: none;
  overflow: scroll;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  
  img {
    height: 60px;
    object-fit: contain;
    margin-right: 10px;
  }
`;

const Input = styled.input`
  width: 50%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const MembershipDescription = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  
  div {
    width: 350px;
    margin-bottom: 10px;
    align-content: center;
  }
  
  img {
    width: 25px;
    height: 30px;
    object-fit: fill;
  }
`

const MembershipContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const ModalContentTitle = styled.div`
  font-size: 20px;
`

const MembershipCard = styled.div`
  width: 450px;
  height: 600px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  margin: 20px 15px;
  padding: 30px 25px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  .amount {
    display: flex;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 15px;
    
    p {
      align-content: end;
      font-size: 20px;
    }
  }
  
  :not(:first-child) {
    margin-top: 5px;
  }
`

const MembershipTitle = styled.div`
  font-size: 28px;
  font-weight: bold;
`

const Title = styled.div`
  font-size: 40px;
  font-weight: bold;
`

const Divider = styled.p`
  border-top: 2px solid rgba(0, 0, 0, 0.2);
`