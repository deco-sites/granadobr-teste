interface SocialItem {
  label: "Facebook" | "Instagram" | "LinkedIn" | "TikTok" | "X" | "YouTube";
  link: string;
}

export interface Social {
  title?: string;
  items: SocialItem[];
}

export interface Props {
  content?: Social;
}
