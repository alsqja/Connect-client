import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ProfileData, UpdateUserData } from "./data";
import { useGetProfile, useUpdateProfile } from "../../hooks/userApi";
import { uploadFile } from "../../hooks/fileApi";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../stores/session";

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [getReq, getRes] = useGetProfile();
  const [updateValues, setUpdateValues] = useState<UpdateUserData | null>({
    name: profile?.name || null,
    oldPassword: null,
    newPassword: null,
    isActiveMatching: profile?.isActiveMatching || true,
    profileUrl: profile?.profileUrl || null,
  });
  const [updateReq, updateRes] = useUpdateProfile();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    getReq();
  }, [getReq]);

  useEffect(() => {
    if (updateRes.data && updateRes.called) {
      alert("수정이 완료되었습니다.");
      setUser((p) => {
        return { ...p, ...updateRes.data.data };
      });
      window.location.reload();
    }
  }, [setUser, updateRes]);

  useEffect(() => {
    if (getRes.data && getRes.called) {
      setProfile(getRes.data.data);
      setUpdateValues({
        name: getRes.data.data.name,
        isActiveMatching: getRes.data.data.isActiveMatching,
        profileUrl: getRes.data.data.profileUrl,
        oldPassword: null,
        newPassword: null,
      });
      setPreviewImage(getRes.data.data.profileUrl); // 초기 이미지 설정
    }
  }, [getRes]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      setImageFile(file);

      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setUpdateValues((prev) =>
          prev ? { ...prev, profileUrl: reader.result as string } : null
        );
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      setImageFile(file);

      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setUpdateValues((prev) =>
          prev ? { ...prev, profileUrl: reader.result as string } : null
        );
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = useCallback(async () => {
    if (!updateValues) {
      alert("변경 정보를 입력해주세요");
      return;
    }

    if (imageFile) {
      const result = await uploadFile(imageFile);

      const profileUrl = process.env.REACT_APP_IMAGE_URL + result;

      updateReq({ ...updateValues, profileUrl });
    } else {
      updateReq(updateValues);
    }
  }, [imageFile, updateReq, updateValues]);

  const handleNavigate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/user/${profile?.id}/feed`);
    },
    [navigate, profile?.id]
  );

  if (!profile) return <div>로딩 중...</div>;

  return (
    <Container>
      <ImageWrapper
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <ProfileImage
          src={previewImage || profile.profileUrl}
          alt="프로필 이미지"
        />
        <UploadMessage>
          클릭하거나 드래그 앤 드롭하여 사진을 변경하세요
        </UploadMessage>
        <FileInput
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <FeedButtonWrapper>
          <FeedButton onClick={(e) => handleNavigate(e)}>피드보기</FeedButton>
        </FeedButtonWrapper>
      </ImageWrapper>
      <InfoWrapper>
        <SubscriptionInfo>
          <div>
            <strong>구독 상태</strong>
            {profile.expiredDate ? (
              <SubscriptionText>
                현재 구독은{" "}
                <SubscriptionDate>{profile.expiredDate}</SubscriptionDate>일
                만료됩니다.
              </SubscriptionText>
            ) : (
              <SubscriptionText>구독 정보가 없습니다.</SubscriptionText>
            )}
          </div>
          <div>
            <strong>소유 포인트 : </strong>
            {profile.point} P
          </div>
        </SubscriptionInfo>
        <ProfileForm>
          <ProfileItem>
            <Label>이메일</Label>
            <Value>{profile.email}</Value>
          </ProfileItem>
          <ProfileItem>
            <Label>생일</Label>
            <Value>
              {profile.birth.slice(0, 4)}년 {profile.birth.slice(4, 6)}월{" "}
              {profile.birth.slice(6)}일
            </Value>
          </ProfileItem>
          <ProfileItem>
            <Label>성별</Label>
            <Value>{profile.gender === "WOMAN" ? "여자" : "남자"}</Value>
          </ProfileItem>
          <ProfileItem>
            <Label>매칭 On/Off</Label>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={updateValues?.isActiveMatching}
                onChange={() =>
                  setUpdateValues((prev) =>
                    prev
                      ? { ...prev, isActiveMatching: !prev.isActiveMatching }
                      : null
                  )
                }
              />
              <ToggleLabel>
                {updateValues?.isActiveMatching ? "On" : "Off"}
              </ToggleLabel>
            </ToggleSwitch>
          </ProfileItem>
          <ProfileItem>
            <Label>이름</Label>
            <Input
              type="text"
              defaultValue={updateValues?.name || ""}
              onChange={(e) =>
                setUpdateValues((p) =>
                  p ? { ...p, name: e.target.value } : null
                )
              }
            />
          </ProfileItem>
          <ProfileItem>
            <Label>변경된 비밀번호</Label>
            <Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={updateValues?.newPassword || ""}
              onChange={(e) =>
                setUpdateValues((p) =>
                  p ? { ...p, newPassword: e.target.value } : null
                )
              }
            />
          </ProfileItem>
          <ProfileItem>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              placeholder="비밀번호 확인 입력"
              value={updateValues?.oldPassword || ""}
              onChange={(e) =>
                setUpdateValues((p) =>
                  p ? { ...p, oldPassword: e.target.value } : null
                )
              }
            />
          </ProfileItem>
          <SubmitButton onClick={handleSubmit}>프로필 수정</SubmitButton>
        </ProfileForm>
      </InfoWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 40px;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 12px;
  width: 80%;
  margin: auto;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 500px;
  border: 2px dashed #ccc;
  border-radius: 20px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;

const UploadMessage = styled.span`
  position: absolute;
  bottom: 70px;
  color: white;
  font-size: 14px;
  text-align: center;
  text-shadow: -1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black;
`;

const FileInput = styled.input`
  display: none;
`;

const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SubscriptionInfo = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;

  div {
    width: 50%;
  }
`;

const SubscriptionText = styled.p`
  font-size: 16px;
  color: #666;
`;

const SubscriptionDate = styled.span`
  color: red;
  font-weight: bold;
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

const Value = styled.span`
  font-size: 16px;
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-right: 10px;
    cursor: pointer;
  }
`;

const ToggleLabel = styled.span`
  font-size: 14px;
`;

const Input = styled.input`
  width: 50%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const FeedButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const FeedButton = styled.button`
  width: 80%;
  padding: 12px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  margin-top: 10px; /* 이미지와의 간격 */

  &:hover {
    background-color: #0056b3;
  }
`;
