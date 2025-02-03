import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { IFeedDetail } from "./data";
import { useDeleteFeed, useGetFeedDetail } from "../../hooks/feedApi";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

interface FeedDetailProps {
  postId: number;
  onClose: () => void;
  currentUserId: number;
  feedUserId: number;
  handleEdit: () => void;
}

export const FeedDetailModal = ({
  postId,
  onClose,
  currentUserId,
  feedUserId,
  handleEdit,
}: FeedDetailProps) => {
  const [post, setPost] = useState<IFeedDetail>();
  const isOwner = post?.userId === currentUserId;
  const [getReq, getRes] = useGetFeedDetail();
  const [deleteReq, deleteRes] = useDeleteFeed();

  useEffect(() => {
    getReq(feedUserId, postId);
  }, [feedUserId, getReq, postId]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setPost(getRes.data.data);
    }
  }, [getRes]);

  const handleDelete = useCallback(() => {
    if (window.confirm("삭제하시겠습니까?")) {
      deleteReq(feedUserId, postId);
    }
  }, [deleteReq, feedUserId, postId]);

  useEffect(() => {
    if (deleteRes.called && !deleteRes.loading && !deleteRes.error) {
      alert("삭제되었습니다.");
      window.location.reload();
    }
  }, [deleteRes]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ProfileContainer>
          <ProfileImage src={post?.userProfileUrl} alt="user profile" />
          <UserInfo>
            <UserName>{post?.userName}</UserName>
            <PostDate>
              {new Date(post?.createdAt || new Date()).toLocaleDateString()}
            </PostDate>
          </UserInfo>
          <ActionButtons>
            {isOwner && (
              <>
                <EditIcon onClick={handleEdit} />
                <DeleteIcon onClick={handleDelete} />
              </>
            )}
            <CloseButton onClick={onClose} />
          </ActionButtons>
        </ProfileContainer>
        <ImageContainer>
          <PostImage src={post?.url} alt="post" />
        </ImageContainer>
        <Description>{post?.description}</Description>
      </ModalContent>
    </ModalOverlay>
  );
};

// 스타일링
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 600px;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const UserInfo = styled.div`
  text-align: left;
  flex-grow: 1;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const PostDate = styled.div`
  font-size: 14px;
  color: #777;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const EditIcon = styled(FaEdit)`
  font-size: 20px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #0056b3;
  }
`;

const DeleteIcon = styled(FaTrash)`
  font-size: 20px;
  color: #aaa;
  cursor: pointer;

  &:hover {
    color: #cc0000;
  }
`;

const CloseButton = styled(FaTimes)`
  font-size: 22px;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: auto;
  border-radius: 10px;
  overflow: hidden;
`;

const PostImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
`;

const Description = styled.p`
  margin-top: 20px;
  font-size: 16px;
  color: #333;
`;
