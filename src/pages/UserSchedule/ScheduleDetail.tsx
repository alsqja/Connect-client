import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IContent } from "./data";
import { useGetScheduleContent } from "../../hooks/scheduleApi";

interface IProps {
  id: number;
  title: string;
  date: string;
}
export const ScheduleDetail = ({ id, title, date }: IProps) => {
  const [contents, setContents] = useState<IContent[]>([]);
  const [getReq, getRes] = useGetScheduleContent();

  useEffect(() => {
    getReq(id);
  }, [id]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setContents(getRes.data.data);
    }
  }, [getRes]);

  return (
    <Container>
      <Header>{date + " " + title}</Header>
      <ContentWrapper>
        {contents.map((content) => (
          <Card key={content.id} imageUrl={content.subCategoryImageUrl || ""}>
            <Overlay>
              <CategoryName>{content.subCategoryName}</CategoryName>
              <Description>{content.description}</Description>
            </Overlay>
          </Card>
        ))}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  /* margin: auto; */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  max-height: calc(100vh - 200px - 10vh);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;

  scrollbar-width: none;
`;

const Card = styled.div<{ imageUrl: string }>`
  position: relative;
  min-height: 150px;
  background-image: ${({ imageUrl }) =>
    imageUrl
      ? `url(${imageUrl})`
      : "linear-gradient(135deg, #e0e0e0, #f5f5f5)"};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); /* 어두운 오버레이 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
  text-align: center;
`;

const CategoryName = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  font-size: 16px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;
