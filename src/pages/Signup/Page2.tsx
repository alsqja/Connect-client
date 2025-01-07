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
    () => image != null && birth.length === 8 && name.length > 0,
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
      {/** TODO : date-picker  */}
      <TextField value={birth} onChange={setBirth} title="생년월일" />
      <RadioContainer>
        <Label>
          <input
            type="radio"
            name="gender"
            value={"남자"}
            checked={gender === "MAN"}
            onChange={() => setGender("MAN")}
          />
          <span style={{ marginLeft: "10px" }}>남자</span>
        </Label>
        <Label>
          <input
            type="radio"
            name="gender"
            value={"여자"}
            checked={gender === "WOMAN"}
            onChange={() => setGender("WOMAN")}
          />
          <span style={{ marginLeft: "10px" }}>여자</span>
        </Label>
      </RadioContainer>
      <BtnContainer>
        <Btn onClick={() => handlePage(0, true)}>이전</Btn>
        <Btn onClick={() => handlePage(2, isFullInput)}>다음</Btn>
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
  height: 45px;
  display: flex;
  justify-content: space-between;
`;

const Btn = styled.div`
  width: 150px;
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

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 320px;
`;

const Label = styled.div`
  font-size: 18px;
  width: 50%;
`;
