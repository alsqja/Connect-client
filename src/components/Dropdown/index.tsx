import styled from "styled-components";
import IconArrow from "./icon-12-arrowdown.svg";
import IconCheck from "./icon__check.svg";
import { useCallback, useMemo, useState } from "react";

export interface IOption {
  id: number;
  label: string;
}

export interface DropdownProps {
  options: IOption[];
  defaultOption?: IOption;
  active?: IOption;
  onSelected?(selected: IOption): void;
  placeholder?: string;
  width?: number;
}

export const Dropdown = ({
  options,
  defaultOption,
  active,
  onSelected,
  placeholder,
  width,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const activeValue = useMemo(
    () => active ?? defaultOption,
    [active, defaultOption]
  );

  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const handleSelect = useCallback(
    (selected: IOption) => () => {
      setOpen(false);
      if (onSelected && selected.id !== activeValue?.id) {
        onSelected(selected);
      }
    },
    [activeValue?.id, onSelected, setOpen]
  );

  return (
    <Wrapper width={width}>
      <Box>
        <Item onClick={handleClick}>
          {activeValue ? activeValue.label : placeholder}
          <Arrow />
        </Item>
      </Box>
      {open && (
        <>
          <Backdrop onClick={handleClick} />
          <List>
            {options.map((i) => (
              <Item key={i.id} onClick={handleSelect(i)}>
                {i.label}
                {i.id === activeValue?.id && <Check />}
              </Item>
            ))}
          </List>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ width?: number }>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  position: relative;
  margin: 20px 0;
`;

const Backdrop = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Box = styled.div`
  border-radius: 4px;
  border: solid 1px #eaeaea;
  background-color: white;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  align-items: center;
  height: 40px;
  cursor: pointer;
`;

const Icon = styled.div`
  flex-shrink: 0;
  background-position: center;
  background-repeat: no-repeat;
`;

const Arrow = styled(Icon)`
  background-image: url(${IconArrow});
  width: 12px;
  height: 12px;
`;

const Check = styled(Icon)`
  background-image: url(${IconCheck});
  width: 16px;
  height: 16px;
`;

const List = styled(Box)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: inherit;
  z-index: 1;
  max-height: 200px;
  overflow-y: scroll;
  scrollbar-width: none;
`;
