import React from "react";
import styled from "styled-components";
import { Post } from "./data";

interface FeedProps {
  posts: Post[];
}

export const Feed = ({ posts }: FeedProps) => {
  return (
    <GridContainer>
      {posts.map((post) => (
        <PostItem key={post.id}>
          <PostImage src={post.url} alt="post" />
          {/* <Description>{post.description}</Description> */}
        </PostItem>
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
`;

const PostItem = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #222;
`;

const PostImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  cursor: pointer;
`;

const Description = styled.p`
  padding: 10px;
  font-size: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0;
  text-align: center;
`;
