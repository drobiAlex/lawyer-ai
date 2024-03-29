import { memo } from "react";

function IndividualOwnerIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="14" y="15" width="20" height="20" rx="10" fill="#152BC5" />
      <rect x="3.5" y="3.5" width="35" height="35" rx="17.5" stroke="#152BC5" />
    </svg>
  );
}

export default memo(IndividualOwnerIcon);
