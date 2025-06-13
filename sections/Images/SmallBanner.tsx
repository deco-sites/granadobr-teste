export { default } from "site/components/smallBanner/index.tsx";

export function LoadingFallback() {
  return (
    <div class="mt-8 md:mt-10">
      <div class="skeleton bg-gray-200 h-full w-full rounded-none pt-[53.33%] md:pt-[26.04%]" />
    </div>
  );
}
