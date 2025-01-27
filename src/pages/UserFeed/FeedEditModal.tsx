import React, {
  useState,
  DragEvent,
  MouseEvent,
  useCallback,
  useEffect,
} from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useUpdateFeed } from "../../hooks/feedApi";
import { uploadFile } from "../../hooks/fileApi";

interface FeedEditModalProps {
  post: {
    id: number;
    url: string;
    description: string;
  };
  onClose: () => void;
  feedUserId: number;
}

export const FeedEditModal = ({
  post,
  onClose,
  feedUserId,
}: FeedEditModalProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(post.url);
  const [description, setDescription] = useState<string>(post.description);
  const [patchReq, patchRes] = useUpdateFeed();

  useEffect(() => {
    setPreview(post.url);
    setDescription(post.description);
  }, [post]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    },
    []
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const selectedFile = event.dataTransfer.files[0];
      setImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    onClose();
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleSave = useCallback(async () => {
    if (!description.trim()) {
      alert("설명을 입력해주세요.");
      return;
    }

    if (image) {
      const result = await uploadFile(image);

      const url = process.env.REACT_APP_IMAGE_URL + result;
      patchReq(feedUserId, url, post.id, description);
    } else {
      patchReq(feedUserId, null, post.id, description);
    }
  }, [description, feedUserId, image, patchReq, post.id]);

  useEffect(() => {
    if (patchRes.data && patchRes.called) {
      alert("수정되었습니다.");
      window.location.reload();
    }
  }, [patchRes]);

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={handleModalClick}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <h2>피드 수정</h2>
        <ImageUploadContainer
          onClick={() => document.getElementById("fileInput")?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {preview ? (
            <PreviewImage src={preview} alt="미리보기" />
          ) : (
            <UploadText>이미지를 업로드하세요</UploadText>
          )}
          <HiddenFileInput
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </ImageUploadContainer>
        <DescriptionInput
          placeholder="설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ButtonContainer>
          <SaveButton onClick={handleSave}>저장</SaveButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

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
  padding: 40px;
  border-radius: 12px;
  width: 500px;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;

  &:hover {
    color: #555;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 20px;
  text-align: center;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  transition: border-color 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    border-color: #007bff;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
`;

const UploadText = styled.div`
  font-size: 18px;
  color: #888;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  margin-bottom: 20px;
  font-family: inherit;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;
