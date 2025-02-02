import styled from "styled-components";
import { TextField } from "../../components/TextField";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ImageField } from "../../components/ImageField";

interface IProps {
  name: string;
  birth: string;
  gender: "MAN" | "WOMAN";
  image: string | null;
  setName: Dispatch<SetStateAction<string>>;
  setBirth: Dispatch<SetStateAction<string>>;
  setGender: Dispatch<SetStateAction<"MAN" | "WOMAN">>;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  setImage: Dispatch<SetStateAction<string | null>>;
  handlePage: (page: number, isFullInput: boolean) => void;
}

export const Page2 = ({
  name,
  birth,
  gender,
  image,
  setImage,
  setName,
  setBirth,
  setGender,
  setImageFile,
  handlePage,
}: IProps) => {
  const isFullInput = useMemo(
    () => image !== null && /^\d{8}$/.test(birth) && name.length > 0,
    [image, birth, name]
  );

  return (
    <Wrapper>
      <ImageField
        setImageFile={setImageFile}
        image={image}
        setImage={setImage}
      />
      <TextField value={name} onChange={setName} title="이름" />
      <TextField
        value={birth}
        onChange={setBirth}
        title="생년월일"
        type="text"
        error={
          !!birth && !/^\d{8}$/.test(birth)
            ? "YYYYMMDD 형식으로 입력해주세요."
            : ""
        }
      />
      <RadioContainer>
        <Label>
          <input
            type="radio"
            name="gender"
            value="남자"
            checked={gender === "MAN"}
            onChange={() => setGender("MAN")}
          />
          <span>남자</span>
        </Label>
        <Label>
          <input
            type="radio"
            name="gender"
            value="여자"
            checked={gender === "WOMAN"}
            onChange={() => setGender("WOMAN")}
          />
          <span>여자</span>
        </Label>
      </RadioContainer>
      <BtnContainer>
        <NavBtn onClick={() => handlePage(0, true)}>이전</NavBtn>
        <NavBtn
          onClick={() => handlePage(2, isFullInput)}
          disabled={!isFullInput}
        >
          다음
        </NavBtn>
      </BtnContainer>
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

const BtnContainer = styled.div`
  width: 320px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const NavBtn = styled.button`
  width: 150px;
  height: 45px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
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

const RadioContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 320px;
  margin-top: 10px;
`;

const Label = styled.label`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
