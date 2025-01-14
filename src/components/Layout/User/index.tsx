import styled from "styled-components";
import { UserHeader } from "./UserHeader";

interface IProps {
  children: React.ReactNode;
}

export const UserLayout = ({ children }: IProps) => {
  return (
    <Wrapper>
      <UserHeader />
      <Container>{children}</Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #f3f3f3;
  height: 100vh;
  width: 100%;
  position: fixed;
  overflow-y: scroll;
  scrollbar-width: none;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 100px;
  justify-content: center;
`;
