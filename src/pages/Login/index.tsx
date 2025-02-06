import styled from "styled-components";
import { TextField } from "../../components/TextField";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLogin } from "../../hooks/session";
import { useRecoilState } from "recoil";
import { userState } from "../../stores/session";
import { useNavigate } from "react-router-dom";
import NaverLogin from "../../components/NaverLogin";
import { useNaverLogin } from "../../hooks/userApi";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginReq, loginRes] = useLogin();
  const [tokens, setTokens] = useRecoilState(userState);
  const navigate = useNavigate();
  const isRequestSent = useRef(false);
  const [naverReq, naverRes] = useNaverLogin();

  const handleLogin = useCallback(() => {
    loginReq(email, password);
  }, [loginReq, email, password]);

  useEffect(() => {
    if (loginRes.called && loginRes.data) {
      setTokens(loginRes.data.data);
    } else if (loginRes.error) {
      alert(loginRes.error);
    }
  }, [loginRes, navigate, setTokens]);

  const handleNavigate = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state && !isRequestSent.current) {
      isRequestSent.current = true;

      naverReq(code, state);
    }
  }, [naverReq, navigate, setTokens]);

  useEffect(() => {
    if (naverRes.data && naverRes.called) {
      setTokens(naverRes.data.data);
      navigate("/main");
    } else if (naverRes.error) {
      alert(naverRes.error);
    }
  }, [naverRes.called, naverRes.data, naverRes.error, navigate, setTokens]);

  useEffect(() => {
    if (!!tokens) {
      if (tokens.role === "USER") navigate("/main");
      else navigate("/admin/user");
    }
  }, [navigate, tokens]);

  return (
    <Wrapper>
      <Container>
        <Title>로그인</Title>
        <TextField title="이메일" value={email} onChange={setEmail} />
        <TextField
          title="비밀번호"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <LoginBtn onClick={handleLogin} disabled={!email || !password}>
          로그인
        </LoginBtn>
        <div>
          아이디가 없으신가요?
          <span
            style={{ color: "#828282", marginLeft: "5px", cursor: "pointer" }}
            onClick={handleNavigate}
          >
            회원가입
          </span>
        </div>
        <NaverLogin />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f3f3;
`;

const Container = styled.div`
  width: 500px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
`;

const Title = styled.span`
  font-size: 30px;
`;

const LoginBtn = styled.button`
  width: 320px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  font-weight: bold;

  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
