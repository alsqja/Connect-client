import React from "react";
import loginBtn from "./loginBtn.png";
import styled from "styled-components";

const NaverLogin = () => {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
  const redirectUri = "http://localhost:3000/login";
  const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=STATE`;

  return (
    <Wrapper>
      <a href={naverLoginUrl}>
        <Nav />
      </a>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const Nav = styled.div`
  all: unset;
  margin: auto;
  width: 200px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-image: url(${loginBtn});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
`;

export default NaverLogin;
