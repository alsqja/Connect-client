import styled from "styled-components";

const MainColorButton = styled.button`
  padding: 5px 10px;
  font-size: 15px;
  border: unset;
  background-color: var(--main-color);
  border-radius: 5px;
  overflow: hidden;
  
  &:active, &:hover {
    background-color: var(--button-active-color);
    color: #fff;
  }
`

export default MainColorButton;