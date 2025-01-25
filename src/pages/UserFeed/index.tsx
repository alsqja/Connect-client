import styled from "styled-components";
import { FeedProfile } from "./FeedProfile";
import { Feed } from "./Feed";
import { useEffect, useState } from "react";
import { IFeedProfile, Post } from "./data";
import { useGetAllFeed, useGetProfile } from "../../hooks/feedApi";

export const UserFeed = () => {
  const userId =
    +window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 2
    ];

  const [posts, setPosts] = useState<Post[]>([]);
  const [getReq, getRes] = useGetAllFeed();
  const [page, setPage] = useState(1);
  const [getProfileReq, getProfileRes] = useGetProfile();
  const [profile, setProfile] = useState<IFeedProfile>();

  useEffect(() => {
    if (!userId) {
      return;
    }
    getReq(userId, page);
    getProfileReq(userId);
  }, [page]);

  useEffect(() => {
    if (getRes.called && getRes.data) {
      setPosts([
        ...getRes.data.data.data,
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
        {
          id: 1,
          userId: 1,
          url: "https://connect-images1.s3.ap-northeast-2.amazonaws.com/0da74490-b23d-4165-9dcf-a96da8c216dc_image+(2).png",
          description: "description",
          createdAt: "2025-01-24T09:23:30.787931",
          updatedAt: "2025-01-24T09:23:30.787931",
        },
      ]);
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
      {posts.length > 0 ? (
        <Feed posts={posts} />
      ) : (
        <div style={{ marginTop: "20px" }}>피드가 없습니다.</div>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;
