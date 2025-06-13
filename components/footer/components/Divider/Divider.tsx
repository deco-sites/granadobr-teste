import { JSX } from "preact";

const Divider = ({ ...props }: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} class={`2xl:container w-full flex ${props.class || ""}`}>
      <div class="border-b border-green-200 2xl:mx-8 w-full" />
    </div>
  );
};

export default Divider;
