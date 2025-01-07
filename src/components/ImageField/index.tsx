import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

interface IProps {
  setImageFile: Dispatch<SetStateAction<File | null>>;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
}

export const ImageField = ({ setImageFile, image, setImage }: IProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setImage]
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        readFile(file);
        setImageFile(file);
      }
    },
    [readFile, setImageFile]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        readFile(file);
        setImageFile(file);
      }
    },
    [readFile, setImageFile]
  );

  const handleWrapperClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <ImageInputWrapper
      onClick={handleWrapperClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={isDragging ? "dragging" : ""}
    >
      {image ? (
        <img src={image} alt="Uploaded preview" />
      ) : (
        <Placeholder>Drag & Drop or Click to Upload</Placeholder>
      )}
      <HiddenInput
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </ImageInputWrapper>
  );
};

export const ImageInputWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
  cursor: pointer;
  background-color: #f8f8f8;
  position: relative;
  margin: 20px;

  &:hover {
    border-color: #aaa;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.dragging {
    border-color: #4caf50;
    background-color: #e8ffe8;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;
