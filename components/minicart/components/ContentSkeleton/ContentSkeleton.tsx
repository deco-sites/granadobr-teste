import Icon from "../../../ui/Icon.tsx";
import Show from "../../../../directives/Show/index.tsx";

import { Props } from "./types.ts";

const ContentSkeleton = ({ showFreeShippingBar }: Props) => {
  return (
    <>
      <div class="flex-grow mt-3 px-4 pb-6 w-full">
        <Show when={showFreeShippingBar}>
          <div class="flex flex-col items-center w-full gap-3 bg-purple-100 rounded p-4 mb-3">
            <span class="block skeleton bg-gray-200 my-[3px] h-3 w-60 rounded-full" />
            <span class="block skeleton bg-gray-200 h-[6px] w-full rounded" />
          </div>
        </Show>

        <ul class="flex flex-col gap-3">
          {new Array(2).fill("").map((_item, index) => (
            <li
              key={index}
              class="flex flex-col bg-purple-100 rounded p-4 gap-4"
            >
              <div class="flex gap-4">
                <div class="skeleton bg-gray-200 h-[70px] min-w-[54px] rounded" />

                <div class="flex flex-col gap-3 w-full">
                  <div class="flex items-center justify-between text-gray-200">
                    <span class="block skeleton bg-gray-200 my-[3px] h-[14px] w-48 rounded-full" />
                    <Icon id="XMark" size={20} strokeWidth={0} />
                  </div>

                  <div class="flex items-end justify-between">
                    <div class="flex items-center justify-around bg-white text-gray-200 w-[90px] h-[34px] rounded">
                      <Icon id="Minus" size={13} strokeWidth={0.01} />
                      <span class="block skeleton bg-gray-200 w-2 h-[14px]" />
                      <Icon id="Plus" size={13} strokeWidth={0.01} />
                    </div>

                    <span class="block skeleton bg-gray-200 my-[3px] h-[14px] w-[55px] rounded-full" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div class="flex mt-6 w-full">
          <div class="flex items-center grow bg-white border border-e-0 border-gray-200 h-[42px] rounded rounded-e-none">
            <span class="block skeleton bg-gray-200 ml-2 w-20 h-[14px]" />
          </div>

          <div class="flex items-center justify-center bg-[#F0F0F0] w-16 h-[42px] rounded rounded-s-none">
            <span class="block skeleton bg-gray-200 w-7 h-[14px]" />
          </div>
        </div>

        <ul class="flex flex-col gap-6 mt-6 w-full">
          {new Array(2).fill("").map((_item, index) => (
            <li
              key={index}
              class="flex item-center justify-between bg-purple-100 p-4 rounded"
            >
              <span class="block skeleton bg-gray-200 w-24 h-[14px] my-[1px]" />
              <span class="block skeleton bg-gray-200 w-3.5 h-3.5 my-[1px] rounded-full" />
            </li>
          ))}
        </ul>
      </div>

      <div class="shadow-[0_3px_28px_rgba(0,0,0,.160)] w-full">
        <div class="flex flex-col gap-4 p-4 pt-6 pb-[18px] w-full">
          <div class="flex justify-between items-center w-full">
            <span class="block skeleton bg-gray-200 w-12 h-[14px]" />
            <span class="block skeleton bg-gray-200 w-14 h-[14px]" />
          </div>

          <div class="flex justify-between items-center w-full">
            <span class="block skeleton bg-gray-200 w-24 h-[16px]" />
            <span class="block skeleton bg-gray-200 w-16 h-[16px]" />
          </div>
        </div>

        <div class="flex items-center w-full">
          <div class="flex items-center justify-center bg-white border border-l-0 border-green-800 h-[52px] w-1/2">
            <span class="block skeleton bg-gray-200 mt-0.5 w-28 h-[14px]" />
          </div>

          <div class="flex items-center justify-center bg-green-800 border border-l-0 border-green-800 h-[52px] w-1/2">
            <span class="block skeleton bg-gray-200 mt-0.5 w-28 h-[14px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentSkeleton;
