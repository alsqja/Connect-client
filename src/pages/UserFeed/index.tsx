import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [hasMore, setHasMore] = useState(true);
  const [getProfileReq, getProfileRes] = useGetProfile();
  const [profile, setProfile] = useState<IFeedProfile>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getReq(userId, page);
    getProfileReq(userId);
  }, [page]);

  useEffect(() => {
    if (getRes.called && getRes.data) {
      setFirstLoad(true);
      setPosts((p) => {
        const newPosts = getRes.data.data.data.filter(
          (newPost: Post) => !p.some((prev) => prev.id === newPost.id)
        );
        return [...p, ...newPosts];
      });

      if (getRes.data.data.data.length < 12) {
        setHasMore(false);
      }
    }
  }, [getRes]);

  useEffect(() => {
    if (getProfileRes.called && getProfileRes.data) {
      setProfile(getProfileRes.data.data);
    }
  }, [getProfileRes]);

  useEffect(() => {
    const currentLoader = loader.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && firstLoad) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [firstLoad, hasMore]);

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
        <Feed
          posts={posts}
          currentUserId={user?.id as number}
          feedUserId={profile?.id as number}
        />
      ) : (
        <NoPosts>피드가 없습니다.</NoPosts>
      )}
      {hasMore && <Loader ref={loader} />}
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

const Loader = styled.div`
  height: 20px;
  background: transparent;
`;
