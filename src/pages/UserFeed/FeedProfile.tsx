import React, { useMemo } from "react";
import styled from "styled-components";
import { IFeedProfile } from "./data";
import { getAge } from "../../utils/functions";
import { useRecoilValue } from "recoil";
import { userState } from "../../stores/session";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface ProfileProps {
  profile: IFeedProfile | undefined;
}

export const FeedProfile = ({ profile }: ProfileProps) => {
  const user = useRecoilValue(userState);
  const isMasked = useMemo(
    () => user?.id !== profile?.id && user?.memberType !== "PREMIUM",
    [profile?.id, user?.id, user?.memberType]
  );

  if (!profile) {
    return <div>로딩중</div>;
  }

  const roundedRate = Math.round(profile.rateAvg * 10) / 10;

  return (
    <ProfileContainer>
      <ProfileImageWrapper>
        <ProfileImage src={profile.profileUrl} alt="profile" />
        {isMasked && (
          <Tooltip>프로필 사진은 프리미엄 회원만 볼 수 있습니다</Tooltip>
        )}
      </ProfileImageWrapper>
      <DescriptionContainer>
        <Username>{profile.name}</Username>
        <Bio>{"나이: " + getAge(profile.birth) + " 살"}</Bio>
        <Bio>{`성별: ${profile.gender === "MAN" ? "남" : "여"}`}</Bio>
        <RatingContainer>
          {Array.from({ length: 5 }, (_, index) => {
            if (index < Math.floor(roundedRate)) {
              return (
                <StarIcon key={index}>
                  <FaStar />
                </StarIcon>
              );
            } else if (
              index === Math.floor(roundedRate) &&
              roundedRate % 1 >= 0.5
            ) {
              return (
                <StarIcon key={index}>
                  <FaStarHalfAlt />
                </StarIcon>
              );
            } else {
              return (
                <StarIcon key={index}>
                  <FaRegStar />
                </StarIcon>
              );
            }
          })}
          <RatingText>
            {roundedRate.toFixed(1) === "NaN"
              ? "리뷰가 없습니다."
              : roundedRate.toFixed(1)}
          </RatingText>
        </RatingContainer>
      </DescriptionContainer>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  text-align: center;
  width: 100%;
  padding: 20px;
  padding-left: 50px;
  display: flex;
  border-bottom: 1px solid #dbdbdb;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  transition: opacity 0.3s ease-in-out;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0.9;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
`;

const Username = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
`;

const Bio = styled.div`
  font-size: 16px;
`;

const DescriptionContainer = styled.div`
  margin-left: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const StarIcon = styled.div`
  font-size: 20px;
  color: #ffd700;
  margin-right: 2px;
`;

const RatingText = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: #666;
`;
