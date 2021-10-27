import React from "react";
import { RelativeToggle } from "./RelativeToggle";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import styled from "styled-components";

export const LeftToggle = ({
  disabled,
  onClick,
  counter,
  open,
  icon,
  title = "",
}) => {
  return (
    <StyledLeftToggle
      variant="link"
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <span className="value">{counter}</span>
      <span className="chevron  mt-1 mb-1">
        {open ? <FiChevronRight /> : <FiChevronLeft />}
      </span>
      {icon && <span className="icon">{icon}</span>}
    </StyledLeftToggle>
  );
};

const StyledLeftToggle = styled(RelativeToggle)`
  top: 50%;
  transform: translateY(-50%);
  flex-direction: column;
  right: 100%;
`;
