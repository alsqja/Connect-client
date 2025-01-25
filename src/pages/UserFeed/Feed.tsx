import React, { useState } from "react";
import styled from "styled-components";
import { Post } from "./data";
import { FeedDetailModal } from "./FeedDetailModal";
import { FeedEditModal } from "./FeedEditModal";

interface FeedProps {
  posts: Post[];
  currentUserId: number;
  feedUserId: number;
}

export const Feed = ({ posts, currentUserId, feedUserId }: FeedProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <GridContainer>
        {posts.map((post) => (
          <PostItem key={post.id} onClick={() => setSelectedPost(post)}>
            <PostImage src={post.url} alt="post" />
          </PostItem>
        ))}
      </GridContainer>
      {selectedPost && (
        <FeedDetailModal
          postId={selectedPost.id}
          onClose={() => setSelectedPost(null)}
          currentUserId={currentUserId}
          feedUserId={feedUserId}
          handleEdit={() => setIsEdit(true)}
        />
      )}
      {isEdit && (
        <FeedEditModal
          post={{
            id: selectedPost?.id as number,
            url: selectedPost?.url as string,
            description: selectedPost?.description as string,
          }}
          onClose={() => setIsEdit(false)}
          feedUserId={feedUserId}
        />
      )}
    </>
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
  cursor: pointer;
`;

const PostImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;
