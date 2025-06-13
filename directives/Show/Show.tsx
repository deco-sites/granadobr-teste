import { Props } from "./types.ts";

const Show = ({ when, children }: Props) => {
  return when ? <>{children}</> : <></>;
};

export default Show;
