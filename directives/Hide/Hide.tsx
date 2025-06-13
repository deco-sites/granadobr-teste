import { Props } from "./types.ts";

const Hide = ({ when, children }: Props) => {
  return when ? <></> : <>{children}</>;
};

export default Hide;
