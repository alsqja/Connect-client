import styled from "styled-components";
import { TextField } from "../../components/TextField";
import {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSendEmail, useVerifyEmailCode } from "../../hooks/userApi";

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
  const [verificationCode, setVerificationCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isCounting, setIsCounting] = useState(false);
  const [sendEmailReq, sendEmailRes] = useSendEmail();
  const [verifyReq, verifyRes] = useVerifyEmailCode();
  const [isVerified, setIsVerified] = useState(false);
  const isFullInput = useMemo(
    () =>
      email.length > 0 &&
      password.length > 0 &&
      isVerified &&
      checkPass.length > 0 &&
      verificationCode.length === 8,
    [
      email.length,
      password.length,
      isVerified,
      checkPass.length,
      verificationCode.length,
    ]
  );

  const handleSendCode = useCallback(() => {
    sendEmailReq(email);
  }, [email, sendEmailReq]);

  const handleVerify = useCallback(() => {
    verifyReq(email, verificationCode);
  }, [email, verificationCode, verifyReq]);

  useEffect(() => {
    if (verifyRes.called && !verifyRes.loading && !verifyRes.error) {
      alert("인증되었습니다.");
      setIsVerified(true);
      setIsCounting(false);
      setIsVerified(false);
      return;
    }
    if (verifyRes.called && !verifyRes.loading && verifyRes.error) {
      alert("인증에 실패했습니다.");
      return;
    }
  }, [verifyRes]);

  useEffect(() => {
    if (sendEmailRes.called && !sendEmailRes.loading && !sendEmailRes.error) {
      setIsSent(true);
      setIsCounting(true);
      setTimeLeft(180);
    }
    if (sendEmailRes.called && !sendEmailRes.loading && sendEmailRes.error) {
      if (sendEmailRes.error === "존재하는 이메일 입니다.") {
        alert("존재하는 이메일 입니다.");
      } else {
        alert("오류가 발생했습니다.");
      }
    }
  }, [sendEmailRes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isCounting]);

  return (
    <Wrapper>
      <InputContainer>
        <TextField value={email} onChange={setEmail} title="이메일" />
        <SmallButton onClick={handleSendCode} disabled={isSent}>
          인증
        </SmallButton>
      </InputContainer>

      {isSent && (
        <>
          <InputContainer>
            <TextField
              value={verificationCode}
              onChange={setVerificationCode}
              title="인증 코드"
            />
            {verificationCode ? (
              <SmallButton onClick={handleVerify}>인증</SmallButton>
            ) : (
              <SmallButton onClick={handleSendCode}>재전송</SmallButton>
            )}
          </InputContainer>
          <Timer>
            {timeLeft > 0
              ? `남은 시간: ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`
              : "시간 초과"}
          </Timer>
        </>
      )}

      <InputContainer>
        <TextField
          value={password}
          onChange={setPassword}
          width={400}
          title="비밀번호"
          type="password"
        />
      </InputContainer>
      <InputContainer>
        <TextField
          value={checkPass}
          onChange={setCheckPass}
          width={400}
          title="비밀번호 확인"
          type="password"
        />
      </InputContainer>
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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 400px;
`;

const SmallButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 36px;
  padding: 0 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Timer = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: red;
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
