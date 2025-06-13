/**
 * @title Configuração dos indexNames
 */
export interface Props {
  /** @title Index de Produtos */
  products: string;
  /** @title Index de Páginas */
  pages?: string;
  /** @title Index de Categorias */
  categories?: string;
}

export interface indexNames {
  products: string;
  pages?: string;
  categories?: string;
}

export default function loader(
  { products, pages, categories }: Props,
): indexNames {
  return {
    products,
    pages,
    categories,
  };
}
