import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Page1 } from "./Page1";
import { Page2 } from "./Page2";
import { Page3 } from "./Page3";
import { uploadFile } from "../../hooks/fileApi";
import { useSignup } from "../../hooks/userApi";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPass, setCheckPass] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState<"MAN" | "WOMAN">("MAN");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [signupReq, signupRes] = useSignup();
  const navigate = useNavigate();

  const handlePage = useCallback(
    (page: number, isFullInput: boolean) => {
      if (isFullInput) {
        setPage(page);
      } else {
        alert("필수 입력 항목을 작성해주세요!");
      }
    },
    [setPage]
  );

  const handleSubmit = useCallback(async () => {
    const result = await uploadFile(imageFile);

    if (result) {
      const profileUrl =
        "https://connect-images1.s3.ap-northeast-2.amazonaws.com/" + result;

      signupReq({
        name,
        email,
        password,
        birth,
        gender,
        profileUrl,
        role: "USER",
        isActiveMatching: true,
      });
    }
  }, [birth, email, gender, imageFile, name, password, signupReq]);

  useEffect(() => {
    if (signupRes.called && signupRes.data) {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    }
  }, [signupRes, navigate]);

  return (
    <Wrapper>
      <Container>
        <Title>회원가입</Title>
        <PageCircleWrapper>
          <PageCircle
            style={{ backgroundColor: `${page === 0 ? "#818181" : "#DADADA"}` }}
          />
          <PageCircle
            style={{ backgroundColor: `${page === 1 ? "#818181" : "#DADADA"}` }}
          />
          <PageCircle
            style={{ backgroundColor: `${page === 2 ? "#818181" : "#DADADA"}` }}
          />
        </PageCircleWrapper>
        {page === 0 && (
          <Page1
            email={email}
            password={password}
            checkPass={checkPass}
            setEmail={setEmail}
            setCheckPass={setCheckPass}
            setPassword={setPassword}
            handlePage={handlePage}
          />
        )}
        {page === 1 && (
          <Page2
            name={name}
            birth={birth}
            gender={gender}
            setName={setName}
            setBirth={setBirth}
            setGender={setGender}
            handlePage={handlePage}
            setImageFile={setImageFile}
            image={image}
            setImage={setImage}
          />
        )}
        {page === 2 && (
          <Page3
            name={name}
            birth={birth}
            gender={gender}
            email={email}
            image={image}
            password={password}
            handleSubmit={handleSubmit}
          />
        )}
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

const PageCircleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70px;
  height: 20px;
`;

const PageCircle = styled.div`
  border-radius: 10px;
  width: 15px;
  height: 15px;
  margin-top: 30px;
`;
