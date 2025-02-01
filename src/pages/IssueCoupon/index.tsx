import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useGetCoupons, useIssueCoupon } from "../../hooks/couponApi";
import { AdminCouponRes, couponFilter } from "../AdminCoupon/data";
import { PaginationContainer } from "../../components/Pagination/PaginationContainer";
import { Modal, Nav, NavItem, NavLink } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";


export const IssueCoupon = (message?: any) => {
  const [getCoupons, getCouponsRes] = useGetCoupons();
  const [issueCoupon] = useIssueCoupon();
  const [coupons, setCoupons] = useState<AdminCouponRes[]>([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [navBar, setNavBar] = useState<couponFilter>("ISSUED_COUPON");
  const [open, setOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<AdminCouponRes | undefined>(undefined)

  const navigate = useNavigate();

  useEffect(() => {
    getCouponData(page, 10, navBar);
  }, [page, navBar]);

  useEffect(() => {
    if (getCouponsRes.data) {
      setCoupons(getCouponsRes.data.data.data);
      setPage(getCouponsRes.data.data.page);
      setTotalElements(getCouponsRes.data.data.totalElements);
    }
  }, [getCouponsRes]);

  const getCouponData = useCallback((page: number, size: number, filter: couponFilter) => {
    getCoupons(page, size, filter);
  }, [getCoupons])

  const issueCouponData = useCallback((id: number) => {
    issueCoupon(id).then(() => {
      alert("쿠폰 발급 성공!");
    }).catch((e) => {
      alert(`쿠폰 발급 실패!\n${e}`);
    }).finally(() => {
      window.location.reload();
    });
  }, [issueCoupon]);

  const couponModalHandler = (data: AdminCouponRes) => {
    setOpen(true);
    setActiveCoupon(data);
  }

  const modalClose = () => {
    setOpen(false);
    setActiveCoupon(undefined);
  }

  const issueCouponButtonHandler = () => {
    if (activeCoupon === undefined) {
      alert("쿠폰 정보가 잘못되었습니다.\n다시 시도해주세요.");
      window.location.reload();
    }
    issueCouponData(activeCoupon?.id as number);
  }

  return (
    <>
      <Container>
        <div className="notice">* 쿠폰 발급 제한 수량을 넘을 경우 공지 없이 발급 중 항목에서 사라질 수 있습니다.</div>
        <NavButtonContainer>
          <NavStyle defaultActiveKey={navBar}>
            <NavItem>
              <NavLink
                eventKey="ISSUED_COUPON"
                onClick={() => setNavBar("ISSUED_COUPON")}>발급 중</NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                eventKey="WAITING_COUPON"
                onClick={() => setNavBar("WAITING_COUPON")}>발급 예정</NavLink>
            </NavItem>
          </NavStyle>
          <Button onClick={() => navigate("/user/my/coupon")}>내 쿠폰함</Button>
        </NavButtonContainer>
        {coupons.map((item, index) => {
          return (
            <CouponContainer key={index}>
              <div>
                <div>쿠폰 명: {item.name}</div>
                {navBar === "ISSUED_COUPON" ?
                  <div>만료일 : ~ {item.expiredDate} 까지</div> :
                  <div>발급 예정 : {item.openDate.replace("T", " ")}</div>
                }
              </div>
              <div>쿠폰 내용: {item.description}</div>
              <div>
                <div>무료 횟수: {item.amount} 회</div>
                <Button size="sm"
                        disabled={navBar !== "ISSUED_COUPON"}
                        onClick={() => couponModalHandler(item)}>
                  {navBar === "ISSUED_COUPON" ? "쿠폰 발급" : "발급 대기"}
                </Button>
              </div>
            </CouponContainer>
          )
        })}
        <PaginationContainer
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalElements}
          pageRangeDisplayed={5}
          onPageChange={setPage} />
      </Container>
      <ModalContainer show={open} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>쿠폰 발급</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>요청에 따라 아래의 쿠폰이 발급됩니다.</div>
          <div className="box">
            <div>쿠폰 이름: {activeCoupon?.name}</div>
            <div>만료일: {activeCoupon?.expiredDate}</div>
          </div>
          <div>쿠폰 내용: {activeCoupon?.description}</div>
          <div>무료 횟수: {activeCoupon?.amount} 회</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={issueCouponButtonHandler}>발급받기</Button>
        </Modal.Footer>
      </ModalContainer>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  gap: 20px;
  border-radius: 12px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px
`

const CouponContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  border: 1px solid #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`

const NavStyle = styled(Nav)<{ defaultActiveKey: couponFilter }>`
  border: 1px solid #f9f9f9;
  
  .nav-item {
    border: 1px solid var(--button-active-color);
    width: 100px;
    text-align: center;
    
    &:first-child {
      border-right: none;
      border-radius: 5px 0 0 5px;
    }
    
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
    
    .nav-link {
      color: #282c34;
    }
    
    .nav-link.active {
      background-color: var(--main-color);
    }
    
    & :hover, :focus {
      background-color: var(--main-color-5);
    }
  }
`

const ModalContainer = styled(Modal)`
  .modal-content {
    width: 800px;
  }
  
  .modal-body {
    align-content: center;
    
    
    div {
      margin: 10px;
      flex: 1;
    }
    
    .box {
      margin: 0;
      display: flex;
    }
  }
  
  .modal-footer {
    justify-content: center;
  }
`