import styled from "styled-components";
import { UserSidebarData } from "./data";

export const UserSidebar = () => {
  return (
    <Wrapper>
      {UserSidebarData.map((el) => (
        <Cell isSelected={el.id === 1} key={el.id}>
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
  border: 1px solid black;
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
