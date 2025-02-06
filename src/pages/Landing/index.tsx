import styled from "styled-components";
import { LandingHeader } from "../../components/Layout/Landing/LandingHeader";
import { LandingContents } from "../../components/Layout/Landing/LandingContents";
import main from "../../assets/images/landing/landing-main.png"
import createSchedule from "../../assets/images/landing/create-schedule.png"
import feed from "../../assets/images/landing/feed.png"
import matchingService from "../../assets/images/landing/matching-service.png"
import matchingFilter from "../../assets/images/landing/matching-filter.png"
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Wrapper>
        <LandingHeader />
        <Container>
          <MainImgContainer src={main}>
            <MainDescription>
              <div>"평범한 하루를 특별한 하루로 만들어 드립니다."</div>
              <div>일정을 새로운 사람과 함께 즐겨보세요!</div>
              <Button onClick={() => navigate("/login")} style={{ top: "50px", position: "relative" }}>Connect
                바로가기</Button>
            </MainDescription>
          </MainImgContainer>
          <LandingContents title={`당신의 하루를\n더 특별하게!`} description={`원하는 일정을 올려보세요!`} image={createSchedule} />
          <LandingContents color={`#f3f3f3`} title={`원하는 조건으로\n걱정없이!`} description={`필터를 통해 \n원하는 조건의 사람과 만날 수 있어요!`}
                           image={matchingFilter} />
          <LandingContents title={`같이 놀러갈 친구\n편하게 찾기!`} description={`매칭 서비스를 통해 편하게 만나 보세요!`}
                           image={matchingService} imageSize={{
            width: 500,
            height: 500
          }} />
          <LandingContents color={`#f3f3f3`} title={`나를 소개하여 \n매칭 성공률 높이기!`} description={`피드를 통해 \n친구에게 나를 소개해 보세요!`}
                           image={feed} imageSize={{
            width: 500,
            height: 500
          }} />
        </Container>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  top: 60px;
  background-color: white;
  scrollbar-width: none;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  justify-content: center;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
`;

const MainImgContainer = styled.div<{ src: string }>`
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${props => props.src}) no-repeat center center;
  background-size: cover;
  scroll-snap-align: start;
`

const MainDescription = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  max-width: 60%;
  
  div:first-child {
    font-size: 36px;
    font-weight: 700;
  }
  
  div:last-child {
    font-size: 20px;
    font-weight: 600;
    margin-top: 10px;
  }
`

const FooterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background-color: #68c8ca;
  scroll-snap-align: start;

`