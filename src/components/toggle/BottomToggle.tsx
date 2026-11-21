import React from "react";
import { RelativeToggle } from "./RelativeToggle";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import styled from "styled-components";

export const BottomToggle = ({
  disabled,
  onClick,
  counter,
  open,
  icon,
  title = "",
}) => {
  return (
    <StyledBottomToggle
      variant="link"
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <span className="value me-1">{counter}</span>
      <span className="chevron">
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </span>
      {icon && <span className="icon ms-1">{icon}</span>}
    </StyledBottomToggle>
  );
};

const StyledBottomToggle = styled(RelativeToggle)`
  top: 100%;
  left: 50%;
  flex-direction: row;
  white-space: nowrap;
  transform: translateX(-50%);
`;
