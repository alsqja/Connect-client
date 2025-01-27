import styled from "styled-components";
import { TextField } from "../../components/TextField";
import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useGetCoupon, usePostCoupon, useUpdateCoupon } from "../../hooks/couponApi";
import { AdminCouponReq, AdminCouponUpdateReq } from "./data";
import { DateSelector } from "../../components/DateSelector";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminCouponDetail = () => {
  const [postCoupon] = usePostCoupon();
  const [getCoupon, getCouponRes] = useGetCoupon();
  const [updateCoupon] = useUpdateCoupon();
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [amount, setAmount] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [description, setDescription] = useState("");
  const [openDate, setOpenDate] = useState("");
  const { pathname } = useLocation();
  const pathNum = pathname.split("/admin/coupon/")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (!Number.isNaN(Number(pathNum))) {
      getCouponData(Number(pathNum));
    }
  }, []);

  const getCouponData = useCallback((id: number) => {
    getCoupon(id).then(r => r);
  }, [getCoupon])

  useEffect(() => {
    if (getCouponRes.data) {
      setName(getCouponRes.data.data.name);
      setCount(getCouponRes.data.data.count);
      setAmount(getCouponRes.data.data.amount);
      setDescription(getCouponRes.data.data.description);
      setExpiredDate(getCouponRes.data.data.expiredDate);
      setOpenDate(getCouponRes.data.data.openDate.replace("T", " "));
    }
  }, [getCouponRes]);

  useEffect(() => {
    if (openDate) {
      setOpenDate(openDate);
    }
  }, [openDate, setOpenDate]);

  const postCouponData = useCallback((data: AdminCouponReq) => {
    postCoupon(data).then(r => {
      alert("정상적으로 저장되었습니다.");
      navigate("/admin/coupon");
    });
  }, [postCoupon])

  const updateCouponData = useCallback((id: number, data: AdminCouponUpdateReq) => {
    updateCoupon(id, data).then(r => {
      if (data.isDeleted) {
        alert("정상적으로 삭제되었습니다.");
        navigate("/admin/coupon");
      } else {
        alert("정상적으로 수정되었습니다.");
        window.location.reload();
      }
    });
  }, [updateCoupon]);

  const addButtonClickHandler = (e: any) => {
    if (
      name === "" || amount === "" || expiredDate === "" || count === "" || description === "" || openDate === ""
    ) {
      alert("내용을 모두 입력해 주세요.");
    } else {
      if (pathNum === "new") {
        postCouponData({
          name: name,
          description: description,
          count: Number(count),
          amount: Number(amount),
          expiredDate: expiredDate,
          openDate: openDate.replace(" ", "T"),
        })
      } else {
        updateCouponData(Number(pathNum), {
          name: name,
          description: description,
          count: Number(count),
          amount: Number(amount),
          expiredDate: expiredDate,
          openDate: openDate.replace(" ", "T"),
          isDeleted: e.target.innerText !== "수정",
        });
      }
    }
  }

  return (
    <>
      <Wrapper>
        <div>
          <Title>쿠폰 생성</Title>
          <InputContainer>
            <InputTitle>이름</InputTitle>
            <TextField title="이름" value={name} onChange={setName} />
          </InputContainer>
          <InputContainer>
            <InputTitle>쿠폰 수량</InputTitle>
            <TextField title="쿠폰 수량" type="number" value={count} onChange={setCount} />
          </InputContainer>
          <InputContainer>
            <InputTitle>무료 횟수</InputTitle>
            <TextField title="무료 횟수" type="number" value={amount} onChange={setAmount} />
          </InputContainer>
          <InputContainer>
            <InputTitle>쿠폰 배포일</InputTitle>
            <DateSelector initialDate={openDate} onDateChange={setOpenDate} type="dateTime" />
          </InputContainer>
          <InputContainer>
            <InputTitle>소멸 기한</InputTitle>
            <DateSelector initialDate={expiredDate} onDateChange={setExpiredDate} />
          </InputContainer>
          <InputContainer>
            <InputTitle>쿠폰 내용</InputTitle>
            <TextField title="쿠폰 내용" width={500} value={description} onChange={setDescription} />
          </InputContainer>
        </div>

        {pathNum !== "new" ?
          <ButtonContainer className="two-button">
            <Button onClick={addButtonClickHandler} style={{ marginRight: "10px" }}>수정</Button>
            <Button onClick={addButtonClickHandler} variant="danger">삭제</Button>
          </ButtonContainer> :
          <ButtonContainer>
            <Button onClick={addButtonClickHandler}>추가</Button>
          </ButtonContainer>
        }
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

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 82px;
  
  input {
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    height: 52px;
    width: 500px;
    border-radius: 4px;
    border: 0.5px solid #eaeaea;
  }
`

const InputTitle = styled.div`
  font-size: 20px;
  width: 200px;
`

const ButtonContainer = styled.div`
  text-align: end;
  
  button {
    width: 100px;
  }
`
