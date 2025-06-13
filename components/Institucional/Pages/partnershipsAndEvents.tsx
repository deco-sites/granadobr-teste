import BaseInstitutionalPage from "../Common/BaseInstitutionalPage.tsx";

interface Props {
  home: string;
  pageTitle: string;
  /**
   * @title Content
   * @format rich-text
   * @description Page content
   */
  pageSubtitle: string;
}

function partnershipsAndEvents({ home, pageTitle, pageSubtitle }: Props) {
  return (
    <BaseInstitutionalPage
      home={home}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
    />
  );
}

export default partnershipsAndEvents;
