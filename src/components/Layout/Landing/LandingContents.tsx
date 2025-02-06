import styled from "styled-components";

interface Props {
  color?: string,
  height?: number,
  title: string,
  description: string,
  image?: string,
  imageSize?: { width: number, height: number },
}

export const LandingContents = ({
                                  color = "#fff",
                                  height = 600,
                                  imageSize = { width: 300, height: 500 },
                                  ...props
                                }: Props) => {
  return (
    <>
      <Container color={color} height={height}>
        <ContentsWrapper>
          <TextArea width={imageSize?.width}>
            <Title>
              {props.title}
            </Title>
            <Description>
              {props.description}
            </Description>
          </TextArea>
          {props?.image &&
              <ImageContainer>
                <Image src={props.image} alt="" width={imageSize?.width} height={imageSize?.height} />
              </ImageContainer>
          }
        </ContentsWrapper>
      </Container>
    </>
  )
}

const Container = styled.div<{ color: string, height: number }>`
  width: 100%;
  height: ${({ height }) => `${height}px`};
  background-color: ${({ color }) => color};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start;
`

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 1000px;
  gap: 40px;
`;

const TextArea = styled.div<{ width: number }>`
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  width: 500px;
`

const Title = styled.div`
  font-size: 35px;
  font-weight: bolder;
`

const Description = styled.div`
  font-size: 20px;
  color: #828282;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: left;
  width: 500px;
`;

const Image = styled.img<{ width: number, height: number }>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};

`