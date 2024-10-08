import { SvgIcon } from "@mui/material";
import React from "react";

export default function ArrowUp(props) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        //   width="24px"
        //   fill="#000000"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M7 14l5-5 5 5z" />
      </svg>
    </SvgIcon>
  );
}
