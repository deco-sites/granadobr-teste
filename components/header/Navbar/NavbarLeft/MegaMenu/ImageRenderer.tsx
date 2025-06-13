import type { ImageObject } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";

interface ImageRendererProps {
  images?: ImageObject[];
  name?: string;
  url?: string;
  width: number;
  height: number;
}

function ImageRenderer({
  images,
  name,
  url,
  width,
  height,
}: ImageRendererProps) {
  return (
    <>
      {images?.map((img) => (
        <a
          href={url || "#"}
          rel="noopener noreferrer"
          title={img.alternateName || img.name}
          aria-label={`View image: ${img.alternateName || img.name}`}
          className="min-w-[80px]"
        >
          <figure className="flex flex-col items-center">
            <Image
              src={img.url || "#"}
              alt={img.alternateName || name}
              width={width}
              height={height}
              loading="lazy"
              fetchPriority="low"
            />
            <figcaption className="font-light text-center w-full text-[14px] font-matria mt-2">
              {name}
            </figcaption>
          </figure>
        </a>
      ))}
    </>
  );
}

export default ImageRenderer;
