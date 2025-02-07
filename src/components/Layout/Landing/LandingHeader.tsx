import logo from '../../../assets/images/logo.png'
import arrow from '../../../assets/images/arrow-right-solid.svg'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <Wrapper>
        <Container>
          <Logo src={logo} />
          <Togo onClick={() => {
            navigate("/login")
          }}>
            <div>Connect 사용하러 가기</div>
            <img src={arrow} />
          </Togo>
        </Container>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Container = styled.div`
  max-width: 100vw;
  padding: 10px 50px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled.img`
  width: 200px;
  height: 55px;
  object-fit: cover;
`;

const Togo = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  
  div {
    height: 20px;
    margin-right: 10px;
    font-weight: bolder;
  }
  
  img {
    height: 20px;
  }
`

