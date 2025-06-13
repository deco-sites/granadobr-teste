import { redirect } from "@deco/deco";

export interface Props {
  exceptions: string[];
  redirectTo: string;
}

export const Empty = () => null;

export const loader = (props: Props, req: Request) => {
  const url = new URL(req.url);

  if (!props.exceptions.includes(url.pathname)) {
    return redirect(props.redirectTo);
  }

  return null;
};

export default Empty;
