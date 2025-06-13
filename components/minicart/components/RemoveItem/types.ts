export interface Props {
  name: string;
  image: {
    src: string;
    alt: string;
  };
  sale: number;
  isGift: boolean;
  locale: string;
  currency: string;
}
