import { ImageWidget } from "apps/admin/widgets.ts";
import { AppContext } from "site/apps/site.ts";

export interface Props {
  backgroundImage: ImageWidget;

  title: string;
  /**
   * @format rich-text
   */
  firstText: string;
  /**
   * @format rich-text
   */
  secondText: string;

  imageRight?: ImageWidget;

  cta: {
    text: string;
    link: string;
  };
}

/**
 * Rendered when a not found is returned by any of the loaders run on this page
 */
function NotFound({
  backgroundImage,
  title,
  cta,
  firstText,
  secondText,
  imageRight,
}: Props) {
  return (
    <div
      class="w-full flex justify-center items-center py-28 bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div class="flex flex-col items-center justify-center gap-6">
        <span class="font-bold text-[72px] text-green-800 tx-mr-eaves-xl-sans">
          {title}
        </span>
        <div
          class="text-sm text-center"
          dangerouslySetInnerHTML={{ __html: firstText }}
        />
        <a
          href={cta.link}
          class="btn no-animation uppercase bg-[#1979c3] text-white"
        >
          {cta.text}
        </a>
        <div
          class="text-sm text-center"
          dangerouslySetInnerHTML={{ __html: secondText }}
        />
      </div>
      {imageRight && (
        <div class="w-1/2 flex justify-end">
          <img src={imageRight} alt="" />
        </div>
      )}
    </div>
  );
}

export const loader = (props: Props, _req: Request, _ctx: AppContext) => {
  // ctx.response.status = 404;

  return {
    ...props,
  };
};

export default NotFound;
