import { useCallback, useState } from "react";
import styled from "styled-components";
import up from "./arrowUp.svg";
import down from "./arrowDown.svg";
import { IDropItem } from "./data";

interface IProps {
  width?: number;
  title: string;
  items: IDropItem[];
  parentsId: number;
  handleCateClick: (id: number) => void;
  handleSubClick: (categoryId: number, id: number) => void;
}
export const Toggle = ({
  width,
  title,
  items,
  handleCateClick,
  parentsId,
  handleSubClick,
}: IProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    handleCateClick(parentsId);
  }, [handleCateClick, parentsId]);

  return (
    <Wrapper>
      <Container width={width}>
        <div onClick={handleOpen} style={{ padding: "10px 20px 10px 0" }}>
          {title}
        </div>
        <img src={open ? up : down} alt="" onClick={() => setOpen(!open)} />
      </Container>
      {open &&
        items.map((el) => (
          <Item key={el.id} onClick={() => handleSubClick(parentsId, el.id)}>
            {el.name}
          </Item>
        ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div<{ width?: number }>`
  width: ${({ width }) => (width ? `${width}px` : "calc(100% - 20px)")};
  height: 50px;
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  background-color: #f9f9f9;

  div {
    cursor: pointer;
  }
  img {
    padding: 10px;
    cursor: pointer;
  }
`;

const Item = styled.div<{ width?: number }>`
  width: ${({ width }) => (width ? `${width}px` : "calc(100% - 40px)")};
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid black;
`;
