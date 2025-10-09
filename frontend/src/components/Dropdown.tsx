import React, { useState } from 'react';
import styled from 'styled-components';

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  selectedValue: string;
  placeholder?: string;
}

const DropdownWrapper = styled.div`
  position: relative;
  width: 200px;
  font-family: sans-serif;
`;

const DropdownButton = styled.button<{ open: boolean }>`
  width: 100%;
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  background: #fff;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: border 0.2s ease;

  &:hover {
    border-color: #888;
  }

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) rotate(${({ open }) => (open ? '180deg' : '0deg')});
    border: 6px solid transparent;
    border-top-color: #333;
    transition: transform 0.2s ease;
  }
`;

const DropdownList = styled.ul<{ open: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  position: absolute;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: translateY(${({ open }) => (open ? '0' : '-10px')});
  transition: all 0.2s ease;
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  selectedValue,
  placeholder = 'Wybierz...',
}) => {
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
          <DropdownItem key={index} onClick={() => handleSelect(option)}>
            {option}
          </DropdownItem>
        ))}
      </DropdownList>
    </DropdownWrapper>
  );
};

export default Dropdown;
