import styled from "styled-components";
import { TextField } from "../../components/TextField";
import { Dispatch, SetStateAction, useMemo } from "react";

interface IProps {
  email: string;
  password: string;
  checkPass: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setCheckPass: Dispatch<SetStateAction<string>>;
  handlePage: (page: number, isFullInput: boolean) => void;
}

export const Page1 = ({
  email,
  password,
  checkPass,
  setCheckPass,
  setEmail,
  setPassword,
  handlePage,
}: IProps) => {
  const isFullInput = useMemo(
    () => email.length > 0 && password.length > 0 && checkPass.length > 0,
    [email, password, checkPass]
  );
  return (
    <Wrapper>
      <TextField value={email} onChange={setEmail} title="이메일" />
      <TextField
        value={password}
        onChange={setPassword}
        title="비밀번호"
        type="password"
      />
      <TextField
        value={checkPass}
        onChange={setCheckPass}
        title="비밀번호 확인"
        type="password"
      />
      <NextBtn onClick={() => handlePage(1, isFullInput)}>다음</NextBtn>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const NextBtn = styled.div`
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
