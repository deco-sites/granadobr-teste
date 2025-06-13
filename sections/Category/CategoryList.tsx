export { default } from "../../components/categoryList/index.tsx";

export function LoadingFallback() {
  return (
    <div class="w-full max-w-screen-4xl 4xl:mx-auto">
      <div class="flex flex-col pt-4 pb-8 md:pb-5">
        <div class="flex flex-col items-center gap-4 mb-8 mx-4 md:mx-6 lg:mx-12 2xl:mx-16">
          <div class="skeleton bg-gray-200 rounded h-9 w-1/3 my-1.5" />
          <div class="skeleton bg-gray-200 rounded h-[18px] w-1/2 my-[3px]" />
        </div>

        <div class="flex flex-col ml-4 md:ml-6 lg:ml-12 2xl:mx-16">
          <div class="carousel gap-4 lg:gap-6">
            {new Array(5).fill("").map((_item, index) => (
              <div
                key={index}
                class="skeleton bg-gray-200 rounded carousel-item aspect-[4.1/5] w-[calc(72.5%_-_8px)] md:w-[calc(22.5%_-_12px)] lg:w-[calc(22.5%_-_18px)] max-h-[300px] sm:max-h-[375px]"
              />
            ))}
          </div>

          <div class="flex justify-center mt-7 mb-3 gap-x-4 md:gap-x-6 gap-y-6 flex-wrap">
            {new Array(2).fill("").map((_item, index) => (
              <div
                key={index}
                class="skeleton bg-gray-200 rounded w-4 md:w-[54px] h-[5px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
