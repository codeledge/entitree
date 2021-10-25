import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import React from "react";
import { RelativeToggle } from "./RelativeToggle";
import styled from "styled-components";

export const TopToggle = ({
  disabled,
  onClick,
  counter,
  open,
  icon,
  title = "",
}) => {
  return (
    <StyledTopToggle
      variant="link"
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <span className="value mr-1">{counter}</span>
      <span className="chevron">
        {open ? <FiChevronDown /> : <FiChevronUp />}
      </span>
      {icon && <span className="icon ml-1">{icon}</span>}
    </StyledTopToggle>
  );
};

const StyledTopToggle = styled(RelativeToggle)`
  bottom: 100%;
  left: 50%;
  flex-direction: row;
  white-space: nowrap;
  transform: translateX(-50%);
`;
