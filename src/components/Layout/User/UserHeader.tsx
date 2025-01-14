import styled from "styled-components";
import logo from "../../../assets/images/logo.png";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { IUserWithToken } from "../../../hooks";
import { userState } from "../../../stores/session";
import { useLogout } from "../../../hooks/session";
import { useNavigate } from "react-router-dom";

export const UserHeader = () => {
  const [user, setUser] = useRecoilState<IUserWithToken | null>(userState);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutReq, logoutRes] = useLogout();
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logoutReq();
  };

  useEffect(() => {
    if (logoutRes.called && !logoutRes.error && !logoutRes.loading) {
      setUser(null);
      alert("로그아웃 되었습니다.");
      window.location.replace("/login");
    }
  }, [logoutRes, setUser]);

  const handleMyPage = () => {
    navigate("/user/my");
  };

  return (
    <Wrapper>
      <Container>
        <Logo src={logo} alt="logo" onClick={() => navigate("/")} />
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
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid black;
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Container = styled.div`
  max-width: 1440px;
  margin: auto;
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
  object-position: center;
  cursor: pointer;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
  position: relative;
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
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;
