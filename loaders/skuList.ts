export type SKUNumber = string;

export type SKUs = SKUNumber[];

interface Props {
  skus: string[];
}

export default function skuList(
  { skus }: Props,
): SKUs {
  return skus;
}
