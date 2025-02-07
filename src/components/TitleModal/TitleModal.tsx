import IconX from "./icon__x.svg";
import styled, { keyframes } from "styled-components";
import { ModalProps } from ".";

export const TitleModal = ({
  title,
  width,
  fullWidth,
  print,
  onClose,
  ...props
}: ModalProps) => {
  return (
    <>
      <Backdrop />
      <ModalContainer onClick={onClose}>
        <Wrapper
          width={width}
          fullWidth={fullWidth}
          print={print}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          <Header width={width}>
            {title?.length && title} {!!onClose && <Close onClick={onClose} />}
          </Header>
          <Body {...props} />
        </Wrapper>
      </ModalContainer>
    </>
  );
};

const Wrapper = styled(({ width, fullWidth, print, ...props }: ModalProps) => (
  <div {...props} />
))<ModalProps>`
  flex-grow: 1;
  position: relative;
  max-height: 80%;
  scrollbar-width: none;
  overflow-y: scroll;
  border-radius: 10px;
  padding: 0 16px 16px 16px;
  background-color: white;
  box-shadow: 0 3px 4px 0 gray;
  width: 21cm;
  ${({ fullWidth, width }) => !fullWidth && `max-width: ${width}px;`}
  ${({ print }) =>
    print &&
    `width: 21cm;
    `}
`;

const Header = styled.header<{ width: number | undefined }>`
  background-color: white;
  position: fixed;
  ${({ width }) => width && `width: ${width - 30}px;`};
  padding-top: 16px;
  border-bottom: 1px solid #f2f2f2;
  min-height: 46px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.27px;
  z-index: 2;
`;

const Body = styled.div`
  padding-top: 80px;
  width: 100%;
`;

export const Close = styled.div`
  position: absolute;
  right: 0px;
  top: 16px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-image: url(${IconX});
  background-position: center;
  :active {
    opacity: 0.5;
  }
`;

const fadeIn = keyframes`
  0%    {opacity: 0;}
  100%  {opacity: 1;}
`;

export const Backdrop = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  z-index: 100;
  background-color: #2c2c2ccc;
  animation: 200ms ${fadeIn} linear;
`;

export const ModalContainer = styled.div`
  position: fixed;
  z-index: 101;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  max-height: 100vh;
`;
