import { memo } from "react";

function ContractorsIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="22" width="20" height="20" rx="10" fill="#E5E5E5" />
      <rect x="22" y="7" width="12" height="12" rx="6" fill="#E5E5E5" />
      <rect x="3" width="12" height="12" rx="6" fill="#E5E5E5" />
      <rect x="30" y="25" width="12" height="12" rx="6" fill="#E5E5E5" />
      <path
        d="M9.5 22L12.3868 17H6.61325L9.5 22ZM10 17.5L10 12H9L9 17.5H10Z"
        fill="#152BC5"
      />
      <path
        d="M17 25.0711L22.5768 23.5768L18.4943 19.4943L17 25.0711ZM23.7175 17.6464L19.8284 21.5355L20.5355 22.2426L24.4246 18.3536L23.7175 17.6464Z"
        fill="#152BC5"
      />
      <path
        d="M20 31.5L25 34.3868V28.6132L20 31.5ZM24.5 32H30V31H24.5V32Z"
        fill="#152BC5"
      />
    </svg>
  );
}

export default memo(ContractorsIcon);
