import styled from "styled-components";
import { useState } from "react";
import showPasswordIcon from "./showPassword.svg";

interface IProps {
  name: string;
  birth: string;
  gender: "MAN" | "WOMAN";
  email: string;
  image: string | null;
  handlePage: (page: number, isFullInput: boolean) => void;
  password: string;
  handleSubmit: () => void;
}

export const Page3 = ({
  name,
  birth,
  gender,
  email,
  image,
  password,
  handlePage,
  handleSubmit,
}: IProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <Wrapper>
      <DataContainer>
        {image && <ImageView src={image} />}
        <TextDataContainer>
          <TextBox>이름 : {name}</TextBox>
          <TextBox>생년월일 : {birth}</TextBox>
          <TextBox>성별 : {gender === "MAN" ? "남자" : "여자"}</TextBox>
          <TextBox>이메일 : {email}</TextBox>
          <TextBox>
            비밀번호 : {isShowPassword ? password : "*".repeat(password.length)}
            <img
              src={showPasswordIcon}
              width={15}
              style={{ marginLeft: "10px", cursor: "pointer" }}
              alt=""
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
          </TextBox>
        </TextDataContainer>
      </DataContainer>
      <SignupBtn onClick={handleSubmit}>회원가입</SignupBtn>
      <SignupBtn
        style={{ marginTop: "10px" }}
        onClick={() => handlePage(1, true)}
      >
        이전
      </SignupBtn>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
`;

const DataContainer = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-between;
`;

const TextDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
  width: 200px;
`;

const TextBox = styled.div`
  flex: 1;
`;

const ImageView = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
`;

const SignupBtn = styled.button`
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
`;
