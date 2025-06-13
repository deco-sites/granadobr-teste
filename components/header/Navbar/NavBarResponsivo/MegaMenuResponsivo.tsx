import type { ComponentChildren } from "preact";

export interface Props {
  children: ComponentChildren;
}

export default function MegaMenuResponsivo({ children }: Props) {
  return (
    <>
      <style>
        {`
      input[type="search"]::-webkit-search-cancel-button {
        -webkit-appearance: none;
        appearance: none;
      }
      `}
      </style>
      <div className="w-screen h-screen flex-1">
        <div style="height: calc(100vh - 4.5rem);">{children}</div>
      </div>
    </>
  );
}
