import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGetUserCoupons } from "../../hooks/userApi";
import { GetCouponData } from "../UserMy/data";
import { useCouponUse } from "../../hooks/couponApi";

interface CouponModalProps {
  onClose: () => void;
  scheduleId: number;
}

export const CouponModal = ({ onClose, scheduleId }: CouponModalProps) => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<GetCouponData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const [firstLoad, setFirstLoad] = useState(false);

  const [getReq, getRes] = useGetUserCoupons();
  const [couponUseReq, couponUseRes] = useCouponUse();

  const loadMoreCoupons = useCallback(() => {
    if (hasMore) {
      getReq(page, 5, "UNUSED");
    }
  }, [page, hasMore, getReq]);

  useEffect(() => {
    loadMoreCoupons();
  }, [page, loadMoreCoupons]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setFirstLoad(true);
      setCoupons((prevCoupons) => {
        const newCoupons = getRes.data.data.data.filter(
          (newCoupon: GetCouponData) =>
            !prevCoupons.some((prev) => prev.id === newCoupon.id)
        );
        return [...prevCoupons, ...newCoupons];
      });

      if (getRes.data.data.data.length < 5) {
        setHasMore(false);
      }
    }
  }, [getRes.called, getRes.data]);

  useEffect(() => {
    const currentLoader = loader.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && firstLoad) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, firstLoad]);

  const handleCouponUse = useCallback(
    (id: number) => {
      couponUseReq(id, scheduleId);
    },
    [couponUseReq, scheduleId]
  );

  useEffect(() => {
    if (couponUseRes.called && couponUseRes.data) {
      alert("쿠폰이 적용되었습니다");
      window.location.reload();
    }
  }, [couponUseRes]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>포인트가 부족합니다!</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <Button onClick={() => navigate("/point")}>포인트 충전하기</Button>
        <Button onClick={() => navigate("/")}>멤버십 가입하기</Button>
        <CouponList>
          <div
            style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
          >
            사용 가능 쿠폰
          </div>
          {coupons.map((coupon) => (
            <CouponItem key={coupon.id}>
              <CouponName>{coupon.couponName}</CouponName>
              <CouponDescription>{coupon.couponDescription}</CouponDescription>
              <CouponDescription>
                무료 매칭 {coupon.amount}회 추가
              </CouponDescription>
              <UseButton onClick={() => handleCouponUse(coupon.id)}>
                사용하기
              </UseButton>
            </CouponItem>
          ))}
          <div ref={loader} style={{ height: "20px" }}></div>
        </CouponList>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  h3 {
    margin: 0;
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;

  &:hover {
    color: #333;
  }
`;

const Button = styled.button`
  width: 200px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004080;
  }
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-height: 400px;
  overflow-y: scroll;
  scrollbar-width: none;
`;

const CouponItem = styled.div`
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CouponName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const CouponDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

const UseButton = styled.button`
  margin-top: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #218838;
  }
`;
