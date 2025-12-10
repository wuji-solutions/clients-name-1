import { useState } from 'react';
import styled from 'styled-components';
import theme from '../common/theme';
import { darkenColor, lightenColor } from '../common/utils';

interface DropdownProps {
  readonly options: string[];
  readonly onSelect: (value: string) => void;
  readonly selectedValue: string;
  readonly placeholder?: string;
}

const DropdownWrapper = styled.div`
  position: relative;
  width: 200px;
  font-family: sans-serif;
`;

const DropdownButton = styled.button<{ open: boolean }>`
  width: 100%;
  padding: 10px 40px 10px 10px;
  border: 4px solid ${theme.palette.main.accent};
  boxShadow: 0 4px 0 0 ${theme.palette.main.accent};
  background: ${lightenColor( theme.palette.main.accent, 0.02)};
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: border 0.2s ease;
  font-size: 19px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  &::placeholder: {
    font-size: 15px;
  };

  &:hover {
    border-color: ${darkenColor( theme.palette.main.accent, 0.04)};
  }

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) rotate(${({ open }) => (open ? '180deg' : '0deg')});
    border: 6px solid transparent;
    border-top-color: #fff;
    transition: transform 0.2s ease;
  }
`;

const DropdownList = styled.ul<{ open: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 8px;
  position: absolute;
  width: 90%;
  max-height: 150px;
  overflow-y: auto;
  border: 4px solid ${darkenColor(theme.palette.main.accent, 0.04)};
  boxShadow: 0 4px 0 0 ${theme.palette.main.accent};
  background: ${lightenColor( theme.palette.main.accent, 0.05)};
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: translateY(${({ open }) => (open ? '0' : '-10px')});
  transition: all 0.2s ease;
  z-index: 10;
  color: #fff;
  text-align: center;
`;  

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: ${lightenColor( theme.palette.main.accent, 0.08)};
  }
`;

export function Dropdown({
  options,
  onSelect,
  selectedValue,
  placeholder = 'Wybierz...',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(selectedValue);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setOpen(false);
  };

  return (
    <DropdownWrapper>
      <DropdownButton onClick={() => setOpen((prev) => !prev)} open={open}>
        {selected || placeholder}
      </DropdownButton>
      <DropdownList open={open}>
        {options.map((option, index) => (
          <DropdownItem key={`dropdown_${option}_${index}`} onClick={() => handleSelect(option)}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </DropdownWrapper>
  );
}

export default Dropdown;
