import { Button } from "react-bootstrap";
import React from "react";

export const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    variant="link"
    aria-haspopup="true"
    ref={ref}
    // no "nav-link": in Bootstrap 5 its color only resolves inside a .nav
    className="dropdown-toggle"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </Button>
));
