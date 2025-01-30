import styled from "styled-components";

interface FilterModalProps {
  onClose: () => void;
  gender: string;
  setGender: (gender: string) => void;
  distance: number;
  setDistance: (distance: number) => void;
  minAge: number;
  setMinAge: (age: number) => void;
  maxAge: number;
  setMaxAge: (age: number) => void;
  isMember: boolean;
}

export const FilterModal = ({
  onClose,
  gender,
  setGender,
  distance,
  setDistance,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  isMember,
}: FilterModalProps) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>매칭 필터 설정</h2>
        <FilterGroup>
          <Label>성별</Label>
          <GenderButtons>
            {["랜덤", "남", "여"].map((g) => (
              <GenderButton
                key={g}
                active={gender === g}
                disabled={!isMember}
                onClick={() => isMember && setGender(g)}
              >
                {g}
              </GenderButton>
            ))}
          </GenderButtons>
        </FilterGroup>
        <FilterGroup>
          <Label>거리: {distance}km</Label>
          <Slider
            type="range"
            min="1"
            max="20"
            value={distance}
            disabled={!isMember}
            onChange={(e) => isMember && setDistance(parseInt(e.target.value))}
          />
        </FilterGroup>
        <FilterGroup>
          <Label>나이 범위</Label>
          <AgeRange>
            <SliderLabel>최소: {minAge}살</SliderLabel>
            <Slider
              type="range"
              min="-10"
              max="10"
              value={minAge}
              disabled={!isMember}
              onChange={(e) => isMember && setMinAge(parseInt(e.target.value))}
            />
            <SliderLabel>최대: {maxAge}살</SliderLabel>
            <Slider
              type="range"
              min="-10"
              max="10"
              value={maxAge}
              disabled={!isMember}
              onChange={(e) => isMember && setMaxAge(parseInt(e.target.value))}
            />
          </AgeRange>
        </FilterGroup>
        <CloseButton onClick={onClose}>확인</CloseButton>
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
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const GenderButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const GenderButton = styled.button<{ active: boolean; disabled: boolean }>`
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ active }) => (active ? "#007bff" : "#ddd")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};

  &:hover {
    background-color: ${({ active, disabled }) =>
      disabled ? "#ddd" : active ? "#0056b3" : "#bbb"};
  }
`;

const Slider = styled.input`
  width: 100%;
`;

const AgeRange = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SliderLabel = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;
