import React from "react";
import { RelativeToggle } from "./RelativeToggle";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styled from "styled-components";

export const RightToggle = ({
  disabled,
  onClick,
  counter,
  open,
  icon,
  title = "",
}) => {
  return (
    <StyledRightToggle
      variant="link"
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <span className="value">{counter}</span>
      <span className="chevron mt-1 mb-1">
        {open ? <FiChevronLeft /> : <FiChevronRight />}
      </span>
      {icon && <span className="icon">{icon}</span>}
    </StyledRightToggle>
  );
};

const StyledRightToggle = styled(RelativeToggle)`
  top: 50%;
  transform: translateY(-50%);
  flex-direction: column;
  left: 100%;
`;
