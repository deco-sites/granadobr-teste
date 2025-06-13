import { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

interface ImageBanner {
  /** @title Imagem desktop */
  desktop: ImageWidget;
  /** @title Imagem mobile */
  mobile: ImageWidget;
  /** @title Texto alternativo */
  alt: string;
}

export interface Props {
  /** @title Imagens */
  image: ImageBanner;
  /** @title Título do banner */
  title?: string;
  /**
   * @title Descrição do banner
   * @format textarea
   */
  description?: string;
}

function BFShowcaseBanner({ title, description, image }: Props) {
  return (
    <div>
      {image && (
        <Picture>
          <Source
            media="(max-width: 768px)"
            src={image.mobile}
            width={380}
            height={128}
          />
          <Source
            media="(min-width: 768px)"
            src={image.desktop}
            width={1305}
            height={300}
          />
          <img
            src={image.desktop}
            alt={image.alt}
            class="w-full h-full object-cover"
          />
        </Picture>
      )}
      {title && (
        <span class="font-granado text-3xl text-green-800 text-left">
          {title}
        </span>
      )}
      {description && (
        <p class="font-matria text-base leading-6 text-green-800 text-left pt-4">
          {description}
        </p>
      )}
    </div>
  );
}

export default BFShowcaseBanner;
