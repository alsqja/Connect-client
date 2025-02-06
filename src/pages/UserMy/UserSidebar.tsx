import styled from "styled-components";
import { UserSidebarData } from "./data";

interface IProps {
  selected: number;
  handleSelected: (index: number) => void;
}

export const UserSidebar = ({ selected, handleSelected }: IProps) => {
  return (
    <Wrapper>
      {UserSidebarData.map((el) => (
        <Cell
          isSelected={el.id === selected}
          key={el.id}
          onClick={() => handleSelected(el.id)}
        >
          {el.label}
        </Cell>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 260px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
`;

const Cell = styled.div<{ isSelected: boolean }>`
  height: 46px;
  margin: 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  background-color: ${({ isSelected }) => (isSelected ? "#f1f1f1" : "white")};
  position: relative;
  
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 10px;
    right: 10px;
    height: 1px;
    background-color: #dbdbdb;
  }
`;
