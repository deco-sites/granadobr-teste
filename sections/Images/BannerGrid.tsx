export { default } from "../../components/ui/BannerGrid.tsx";

export function LoadingFallback() {
  return (
    <div class="mx-4 md:mx-0 w-[calc(100%_-_32px)] md:w-full">
      <div class="grid gap-2.5 grid-cols-1 md:grid-cols-[60%_40%] md:grid-rows-[280px_280px] w-full md:w-[calc(100%_-_10px)]">
        {new Array(3).fill("").map((_item, index) => (
          <div
            key={index}
            class="skeleton bg-gray-200 pt-[40.93%] md:pt-0 md:first-of-type:pt-[69.51%] md:first-of-type:col-start-1 md:first-of-type:row-start-1 md:first-of-type:row-end-3 rounded md:rounded-none md:first-of-type:rounded-r md:first-of-type:rounded-l-none md:rounded-l min-h-44 h-44 md:h-full first-of-type:h-full w-full"
          />
        ))}
      </div>
    </div>
  );
}
