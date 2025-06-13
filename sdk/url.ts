export const relative = (link?: string | undefined) => {
  const linkUrl = link ? new URL(link) : undefined;
  const linkPath = linkUrl ? `${linkUrl.pathname}${linkUrl.search}` : undefined;
  return linkPath;
};

export const absolutePathToStore = (link?: string | undefined) => {
  const linkUrl = link ? new URL(link) : undefined;
  const linkPath = new URL(
    linkUrl?.pathname ?? "",
    "https://www.granado.com.br/",
  );
  return linkPath;
};
