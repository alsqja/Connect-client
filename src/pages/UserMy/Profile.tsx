import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ProfileData, UpdateUserData } from "./data";
import { useDeleteUser, useGetProfile, useUpdateProfile, } from "../../hooks/userApi";
import { uploadFile } from "../../hooks/fileApi";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../stores/session";
import Button from "react-bootstrap/Button";
import { useMembershipDelete } from "../../hooks/membershipApi";
import { Modal } from "react-bootstrap";

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [getReq, getRes] = useGetProfile();
  const [delMembership] = useMembershipDelete();
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
  const [deleteReq, deleteRes] = useDeleteUser();

  // 회원탈퇴 모달 열림/닫힘 상태
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  // 모달 내부 비밀번호 상태
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const deleteMembership = useCallback(() => {
    delMembership().then(() => {
      alert("멤버십이 취소되었습니다.");
      window.location.reload();
    });
  }, [delMembership])

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

  /** 이미지 업로드 핸들러 */
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

  /** 드래그 앤 드롭 */
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

  /** 프로필 수정 핸들러 */
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

  /** 피드보기 이동 */
  const handleNavigate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/user/${profile?.id}/feed`);
    },
    [navigate, profile?.id]
  );

  /** 회원탈퇴 버튼 클릭 -> 모달 열기 */
  const handleWithdrawalClick = useCallback(() => {
    setShowWithdrawModal(true);
  }, []);

  /** 회원탈퇴 모달 내 "확인" 버튼 -> 실제 탈퇴 로직 처리 */
  const handleWithdrawConfirm = useCallback(() => {
    if (withdrawPassword === "회원 탈퇴") {
      deleteReq();
    } else {
      alert("회원 탈퇴를 입력해 주세요.");
    }
  }, [deleteReq, withdrawPassword]);

  /** 회원탈퇴 모달 내 "취소" 버튼 -> 모달 닫기 */
  const handleWithdrawCancel = useCallback(() => {
    setShowWithdrawModal(false);
  }, []);

  useEffect(() => {
    if (deleteRes.called && !deleteRes.error && !deleteRes.loading) {
      alert("회원 탈퇴 되었습니다.");
      setUser(null);
      window.location.replace("/login");
    }
  }, [deleteRes.called, deleteRes.error, deleteRes.loading, setUser]);

  if (!profile) return <div>로딩 중...</div>;

  return (
    <>
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
            <FeedButton onClick={handleNavigate}>피드보기</FeedButton>
          </FeedButtonWrapper>
        </ImageWrapper>

        <InfoWrapper>
          <SubscriptionInfo>
            <div>
              <strong>멤버십 상태</strong>
              {profile.expiredDate ? (
                <>
                  {profile.isActiveMembership ? (
                    <>
                      <SubscriptionText>
                        현재 멤버십은{" "}
                        <SubscriptionDate>{profile.expiredDate}</SubscriptionDate>일
                        만료됩니다. <br /> 현재 고객님은 {profile.membershipType} 등급입니다.
                      </SubscriptionText>
                      <Button onClick={() => setOpenModal(true)} variant="danger">멤버십 취소하기</Button>
                    </>
                  ) : (
                    <>
                      <SubscriptionText>
                        현재 멤버십은{" "}
                        <SubscriptionDate>{profile.expiredDate}</SubscriptionDate>일
                        만료됩니다. <br />{profile.membershipType} 멤버십 취소가 예약되어있습니다.
                      </SubscriptionText>
                    </>
                  )}
                </>
              ) : (
                <>
                  <SubscriptionText>멤버십 정보가 없습니다.</SubscriptionText>
                  <Button onClick={() => navigate("/user/membership")}>멤버십 등록</Button>
                </>
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

            {/* 프로필 수정 버튼 */}
            <SubmitButton onClick={handleSubmit}>프로필 수정</SubmitButton>

            {/* 회원탈퇴 버튼 */}
            <WithdrawalButton onClick={handleWithdrawalClick}>
              회원탈퇴
            </WithdrawalButton>
          </ProfileForm>
        </InfoWrapper>
      </Container>

      <Modal show={openModal}>
        <Modal.Header closeButton>
          <Modal.Title>멤버십 취소</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>정말 멤버십을 취소하시겠습니까?</div>
          <div>[ 확인 ] 버튼을 누르시면 멤버십이 취소 됩니다.</div>
          <div className="notice">* 멤버십 기간 만료 후 기능을 더이상 사용할 수 없게됩니다.</div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button onClick={deleteMembership} variant="danger">확인</Button>
          <Button onClick={() => setOpenModal(false)}>취소</Button>
        </Modal.Footer>
      </Modal>

      {/* 회원탈퇴 모달 */}
      {showWithdrawModal && (
        <ModalOverlay onClick={() => setShowWithdrawModal(false)}>
          <ModalWrapper onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowWithdrawModal(false)}>
              X
            </CloseButton>
            <ModalTitle>회원 탈퇴</ModalTitle>
            <p>정말 탈퇴하시겠습니까? 탈퇴하려면 "회원 탈퇴"를 입력해주세요.</p>
            <PasswordInput
              type="text"
              placeholder="회원 탈퇴"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
            />

            <ButtonGroup>
              <ConfirmButton
                onClick={handleWithdrawConfirm}
                disabled={withdrawPassword !== "회원 탈퇴"}
              >
                확인
              </ConfirmButton>
              <CancelButton onClick={handleWithdrawCancel}>취소</CancelButton>
            </ButtonGroup>
          </ModalWrapper>
        </ModalOverlay>
      )}
    </>
  );
};

/* --------------------- 스타일 --------------------- */

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

/** 회원탈퇴 버튼 */
const WithdrawalButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
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

/* --------------------- 모달 --------------------- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  background: #fff;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
  padding: 20px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const PasswordInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ConfirmButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #565e64;
  }
`;
