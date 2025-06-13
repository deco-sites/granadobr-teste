import { type Section } from "@deco/deco/blocks";
export interface Props {
  sections: Section[];
}
const Container = ({ sections }: Props) => {
  return (
    <>
      {sections.map(({ Component, props }, index) => (
        <Component key={index} {...props} />
      ))}
    </>
  );
};
export default Container;
