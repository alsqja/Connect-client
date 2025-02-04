import styled from "styled-components";
import logo from "../../../assets/images/logo.png";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState } from "recoil";
import { IUserWithToken } from "../../../hooks";
import { userState } from "../../../stores/session";
import { useLogout } from "../../../hooks/session";
import { useLocation, useNavigate } from "react-router-dom";
import MainColorButton from "../../Button/MainColorButton";
import { FaBell, FaStar } from "react-icons/fa";
import { useReadAllNotify } from "../../../hooks/notifyApi";
import { useCreateReview } from "../../../hooks/matchingApi";

export const UserHeader = () => {
  const [user, setUser] = useRecoilState<IUserWithToken | null>(userState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutReq, logoutRes] = useLogout();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [notifications, setNotifications] = useState<any[]>(() => {
    const savedNotis = localStorage.getItem("notifications/" + user?.id);
    return savedNotis ? JSON.parse(savedNotis) : [];
  });

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [readAllNotiReq, readAllNotiRes] = useReadAllNotify();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewUrl, setReviewUrl] = useState("");
  const [postReviewReq, postReviewRes] = useCreateReview();
  const [reviewMessage, setReviewMessage] = useState("");

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
    setNotificationOpen(false);
  };

  const handleLogout = () => {
    logoutReq();
    handleDropdownToggle();
  };

  useEffect(() => {
    if (logoutRes.called && !logoutRes.error && !logoutRes.loading) {
      setUser(null);
      alert("로그아웃 되었습니다.");
      window.location.replace("/login");
    }
  }, [logoutRes, setUser]);

  const handleMyPage = () => {
    navigate("/user/my/profile");
    handleDropdownToggle();
  };

  const maxRetries = 5;
  const reconnectDelay = 3000;
  const retryCount = useRef(0);

  const connectToSSE = useCallback(() => {
    if (!user) return;

    const eventSource = new EventSource(
      `http://localhost:8080/api/sse/subscribe/${user.id}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
      retryCount.current = 0;
    };

    eventSource.addEventListener("notify", (e: any) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "REVIEW") {
          setIsReviewModalOpen(true);
          setReviewUrl(data.url);
          setReviewMessage(data.content);
        } else {
          const newNoti = { ...data, read: false };
          setNotifications((prev) => [newNoti, ...prev]);
          setHasNewNotification(true);
        }
      } catch (err) {
        console.error("알림 JSON 파싱 에러", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE 에러 -> 재연결 시도", err);
      eventSource.close();
      if (retryCount.current < maxRetries) {
        setTimeout(() => {
          retryCount.current += 1;
          console.log(`재연결 시도 #${retryCount.current}`);
          connectToSSE();
        }, reconnectDelay);
      } else {
        console.error("최대 재연결 시도 횟수 초과");
      }
    };
  }, [user]);

  useEffect(() => {
    connectToSSE();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connectToSSE, user]);

  const handleNotificationClick = () => {
    setNotificationOpen((prev) => !prev);
    setDropdownOpen(false);
    if (notificationOpen) {
      readAllNotiReq(user?.id as number);
    }
  };

  useEffect(() => {
    if (
      readAllNotiRes.called &&
      !readAllNotiRes.error &&
      !readAllNotiRes.loading
    ) {
      setHasNewNotification(false);
      setNotifications((prev) => {
        const updated = prev.map((noti) => ({ ...noti, read: true }));
        localStorage.setItem(
          "notifications/" + user?.id,
          JSON.stringify(updated)
        );
        return updated;
      });
    }
  }, [readAllNotiRes, user?.id]);

  const handleNotiClick = useCallback(
    (url: string, type: string) => {
      if (type === "REVIEW") {
        setIsReviewModalOpen(true);
      } else {
        setNotifications((prev) => {
          const updated = prev.map((noti) => ({ ...noti, read: true }));
          localStorage.setItem(
            "notifications/" + user?.id,
            JSON.stringify(updated)
          );
          return updated;
        });
        window.location.replace(url);
      }
    },
    [user?.id]
  );

  const handleStarClick = (rating: number) => {
    setReviewRating(rating);
  };

  const handlePostReview = useCallback(() => {
    const userId = reviewUrl.split("/")[3];
    const matchingId = reviewUrl.split("/")[1];
    postReviewReq(+userId, +matchingId, reviewRating);
  }, [postReviewReq, reviewRating, reviewUrl]);

  useEffect(() => {
    if (postReviewRes.called && postReviewRes.data) {
      alert("리뷰 작성이 완료되었습니다.");
      readAllNotiReq(user?.id as number);
      window.location.reload();
    }
  }, [postReviewRes, readAllNotiReq, user?.id]);

  return (
    <Wrapper>
      <Container>
        <Logo src={logo} alt="logo" onClick={() => navigate("/")} />

        <RightHeader>
          {user?.role !== "ADMIN" && pathname !== "/issue/coupon" && (
            <MainColorButton onClick={() => navigate("/issue/coupon")}>
              쿠폰 발급
            </MainColorButton>
          )}
          {user?.role !== "ADMIN" && pathname !== "/point" && (
            <MainColorButton onClick={() => navigate("/point")}>
              포인트 충전
            </MainColorButton>
          )}
          {user && (
            <NotificationIconWrapper onClick={handleNotificationClick}>
              <BellIcon hasNew={hasNewNotification} />
              {notificationOpen && (
                <NotificationDropdown>
                  {notifications.length === 0 ? (
                    <NoNotification>새로운 알림이 없습니다.</NoNotification>
                  ) : (
                    notifications.map((noti, idx) => (
                      <NotificationItem
                        key={idx}
                        onClick={() => handleNotiClick(noti.url, noti.type)}
                        read={noti.read}
                      >
                        <div>{noti.content}</div>
                      </NotificationItem>
                    ))
                  )}
                </NotificationDropdown>
              )}
            </NotificationIconWrapper>
          )}
          {user ? (
            <UserProfile onClick={handleDropdownToggle}>
              <ProfileImage src={user?.profileUrl || ""} alt="user profile" />
              <UserName>{user?.name}</UserName>
            </UserProfile>
          ) : (
            <>로그인</>
          )}
          {dropdownOpen && (
            <Dropdown>
              {user?.role === "USER" && (
                <DropdownItem onClick={handleMyPage}>마이페이지</DropdownItem>
              )}
              <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
            </Dropdown>
          )}
        </RightHeader>

        {isReviewModalOpen && (
          <ReviewModal onClick={() => setIsReviewModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>리뷰 작성</h3>
              <div>{reviewMessage}</div>
              <Stars>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    selected={star <= (hoverRating || reviewRating)}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <FaStar />
                  </Star>
                ))}
              </Stars>
              <MainColorButton onClick={handlePostReview}>
                제출하기
              </MainColorButton>
            </ModalContent>
          </ReviewModal>
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Container = styled.div`
  max-width: 100vw;
  padding: 10px 50px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled.img`
  width: 200px;
  height: 55px;
  object-fit: cover;
  cursor: pointer;
`;

const RightHeader = styled.div`
  display: flex;
  button {
    margin-right: 30px;
    width: 100px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 150px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const BellIcon = styled(({ hasNew, ...props }: any) => <FaBell {...props} />)`
  position: relative;
  top: 6px;
  font-size: 24px;
  margin-right: 20px;
  color: ${({ hasNew }) => (hasNew ? "red" : "#555")};
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 250px;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const NoNotification = styled.div`
  padding: 12px;
  font-size: 14px;
  color: #999;
`;

const NotificationItem = styled.div<{ read: boolean }>`
  padding: 12px;
  font-size: 14px;
  color: ${({ read }) => (read ? "#999" : "#333")};
  background-color: ${({ read }) => (read ? "#f9f9f9" : "#fff")};
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ReviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const Star = styled.div<{ selected: boolean }>`
  font-size: 30px;
  color: ${({ selected }) => (selected ? "#FFD700" : "#ddd")};
  cursor: pointer;
  transition: color 0.2s;

  &:hover,
  &:hover ~ & {
    color: #ffd700;
  }
`;
