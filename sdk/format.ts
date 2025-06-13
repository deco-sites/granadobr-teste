const formatters = new Map<string, Intl.NumberFormat>();

const formatter = (currency: string, locale: string) => {
  const key = `${currency}::${locale}`;

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    );
  }

  return formatters.get(key)!;
};

export const formatPrice = (
  price: number | undefined,
  currency = "BRL",
  locale = "pt-BR",
) => (price ? formatter(currency, locale).format(price) : null);

export const formatZipCode = (zipCode: string) => {
  return zipCode.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");
};

export const preventXSS = (text: string) => {
  return text.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
};
