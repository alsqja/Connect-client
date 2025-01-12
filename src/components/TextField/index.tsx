import { Dispatch, SetStateAction, useRef } from "react";
import styled from "styled-components";

interface IProps {
  title: string;
  value: string;
  type?: string;
  error?: string;
  width?: number;
  onChange: Dispatch<SetStateAction<string>>;
  handleEnter?: () => void;
}

export const TextField = ({
  title,
  value,
  type = "text",
  error,
  width,
  onChange = () => {},
  handleEnter,
}: IProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <InputWrapper width={width ? width : 320}>
      <InputBox
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleEnter && handleEnter();
          }
        }}
        required
        type={type}
        ref={ref}
      />
      <InputTitle onClick={() => ref.current && ref.current.focus()}>
        {title}
      </InputTitle>
      {error && <Warnning>{error}</Warnning>}
    </InputWrapper>
  );
};

const InputWrapper = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 52px;
  position: relative;
  margin: 15px 0;
`;

const InputTitle = styled.span`
  position: absolute;
  top: 13px;
  left: 20px;
  font-size: 17px;
  transition: 0.3s;
  background-color: white;
  padding: 0 5px;
`;

const InputBox = styled.input`
  all: unset;
  width: 100%;
  height: 100%;
  font-size: 15px;
  border-radius: 4px;
  padding-left: 20px;
  box-sizing: border-box;
  border: 0.5px solid #eaeaea;
  &:focus {
    border: 2px solid #007bff;
  }
  &:focus ~ span,
  &:valid ~ span {
    top: -5px;
    font-size: 14px;
    color: skyblue;
  }
`;

const Warnning = styled.div`
  color: red;
  padding: 5px 0 0 10px;
  font-size: 12px;
`;
