import styled from "styled-components";
import logo from "../../../assets/images/logo.png";
import React, { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { IUserWithToken } from "../../../hooks";
import { userState } from "../../../stores/session";
import { useLogout } from "../../../hooks/session";
import { useLocation, useNavigate } from "react-router-dom";
import MainColorButton from "../../Button/MainColorButton";
import { FaBell } from "react-icons/fa";
import { useReadAllNotify } from "../../../hooks/notifyApi";

export const UserHeader = () => {
  const [user, setUser] = useRecoilState<IUserWithToken | null>(userState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutReq, logoutRes] = useLogout();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [notifications, setNotifications] = useState<any[]>(() => {
    const savedNotis = localStorage.getItem("notifications");
    return savedNotis ? JSON.parse(savedNotis) : [];
  });

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [readAllNotiReq, readAllNotiRes] = useReadAllNotify();
  const eventSourceRef = useRef<EventSource | null>(null);

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

  useEffect(() => {
    if (!user) return;

    const eventSource = new EventSource(
      `http://localhost:8080/api/sse/subscribe/${user.id}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
    };

    eventSource.addEventListener("notify", (e: any) => {
      try {
        const data = JSON.parse(e.data);
        const newNoti = { ...data, read: false };
        setNotifications((prev) => {
          const isDuplicate = prev.some((noti) => noti.id === newNoti.id);
          if (isDuplicate) return prev;
          const updated = [newNoti, ...prev].slice(0, 20);
          localStorage.setItem("notifications", JSON.stringify(updated));
          return updated;
        });
        setHasNewNotification(true);
      } catch (err) {
        console.error("알림 JSON 파싱 에러", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE 에러:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

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
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    }
  }, [readAllNotiRes]);

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
                        onClick={() => navigate(noti.url)}
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
