import styled from "styled-components";
import { TextField } from "../../components/TextField";
import { useCallback, useEffect, useState } from "react";
import { useLogin } from "../../hooks/session";
import { useSetRecoilState } from "recoil";
import { userState } from "../../stores/session";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginReq, loginRes] = useLogin();
  const setTokens = useSetRecoilState(userState);
  const navigate = useNavigate();

  const handleLogin = useCallback(() => {
    loginReq(email, password);
  }, [loginReq, email, password]);

  useEffect(() => {
    if (loginRes.called && loginRes.data) {
      setTokens(loginRes.data.data);

      if (loginRes.data.data.role === "ADMIN") {
        navigate("/admin/user");
      } else {
        navigate("/");
      }
    }
  }, [loginRes, navigate, setTokens]);

  const handleNavigate = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

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
        <LoginBtn onClick={handleLogin}>로그인</LoginBtn>
        <div>
          아이디가 없으신가요?
          <span
            style={{ color: "#828282", marginLeft: "5px", cursor: "pointer" }}
            onClick={handleNavigate}
          >
            회원가입
          </span>
        </div>
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

const LoginBtn = styled.div`
  width: 320px;
  height: 45px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid black;
  margin-top: 30px;
  margin-bottom: 20px;
`;
