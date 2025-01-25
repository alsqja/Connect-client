import React from "react";
import styled from "styled-components";
import { IFeedProfile } from "./data";

interface ProfileProps {
  profile: IFeedProfile | undefined;
}

export const FeedProfile = ({ profile }: ProfileProps) => {
  if (!profile) {
    return <div>로딩중</div>;
  }
  return (
    <ProfileContainer>
      <ProfileImage src={profile.profileUrl} alt="profile" />
      <DescriptionContainer>
        <Username>{profile.name}</Username>
        <Bio>{profile.birth}</Bio>
        <Bio>{profile.gender}</Bio>
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

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
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
