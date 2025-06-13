import algoliaRecommend from "https://esm.sh/@algolia/recommend@4.24.0";
import type { RecommendClient } from "https://esm.sh/@algolia/recommend@4.24.0";

export type AlgoliaRecommend = RecommendClient;

export interface Props {
  apiKey: string;
  applicationId: string;
}

export default function loader(
  { apiKey, applicationId }: Props,
): AlgoliaRecommend {
  //@ts-ignore algliaRecomend is any
  const client = algoliaRecommend(
    applicationId,
    apiKey,
  );
  return client;
}
