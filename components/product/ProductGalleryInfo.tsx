import { type SectionProps } from "@deco/deco";
/**
 * @title {{{title}}}
 */
interface Content {
  /** @title Title */
  title?: string;
  /**
   * @title text
   * @format rich-text
   * @description Page text
   */
  text: string;
}
/**
 * @titleBy matcher
 */
interface Info {
  matcher: string;
  contents: Content[];
}
interface Props {
  productGalleryInfos: Info[];
}
function ProductGalleryInfo(props: SectionProps<ReturnType<typeof loader>>) {
  const { contents } = props;
  return (
    <div className="container px-4 pb-10 mt-6 flex">
      <div class="hidden sm:block w-min min-w-[380px]"></div>
      <div>
        {contents.map((content, index) => (
          <div key={index}>
            {content.title && (
              <h1 className="text-[28px] font-medium my-4 uppercase text-green-800 font-granado">
                {content.title}
              </h1>
            )}
            <div
              className="text-base leading-7 font-matria font-normal text-green-800"
              dangerouslySetInnerHTML={{ __html: content.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export const loader = (props: Props, req: Request) => {
  const { productGalleryInfos } = props;
  const matchedInfo = productGalleryInfos.find((info) =>
    new URLPattern({ pathname: info.matcher }).test(req.url)
  );
  return { contents: matchedInfo ? matchedInfo.contents : [] };
};
export default ProductGalleryInfo;
