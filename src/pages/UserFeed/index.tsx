import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FeedProfile } from "./FeedProfile";
import { Feed } from "./Feed";
import { IFeedProfile, Post } from "./data";
import { useGetAllFeed, useGetProfile } from "../../hooks/feedApi";
import { useRecoilValue } from "recoil";
import { userState } from "../../stores/session";
import { FeedUploadModal } from "./FeedUploadModal";

export const UserFeed = () => {
  const user = useRecoilValue(userState);
  const userId = +window.location.pathname.split("/").slice(-2, -1)[0];

  const [posts, setPosts] = useState<Post[]>([]);
  const [getReq, getRes] = useGetAllFeed();
  const [page, setPage] = useState(1);
  const [getProfileReq, getProfileRes] = useGetProfile();
  const [profile, setProfile] = useState<IFeedProfile>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getReq(userId, page);
    getProfileReq(userId);
  }, [page]);

  useEffect(() => {
    if (getRes.called && getRes.data) {
      setPosts([...getRes.data.data.data]);
    }
  }, [getRes]);

  useEffect(() => {
    if (getProfileRes.called && getProfileRes.data) {
      setProfile(getProfileRes.data.data);
    }
  }, [getProfileRes]);

  return (
    <Container>
      <FeedProfile profile={profile} />
      {user?.id === userId && (
        <AddPostButton onClick={() => setIsModalOpen(true)}>+</AddPostButton>
      )}
      {isModalOpen && (
        <FeedUploadModal onClose={() => setIsModalOpen(false)} id={userId} />
      )}
      {posts.length > 0 ? (
        <Feed posts={posts} />
      ) : (
        <NoPosts>피드가 없습니다.</NoPosts>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 200px);
  position: relative;
`;

const AddPostButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border: 2px dashed #ccc;
  width: 50px;
  height: 50px;
  font-size: 32px;
  line-height: 50px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    border-color: #007bff;
  }
`;

const NoPosts = styled.div`
  margin-top: 20px;
  text-align: center;
  color: #777;
  font-size: 18px;
`;
