import Icon from "../../../../../ui/Icon.tsx";

const FallbackLoading = () => {
  return (
    <div class="flex flex-col items-center justify-center relative">
      <Icon size={27} id="ShoppingCart" />

      <div class="absolute -top-1 -right-1 md:-right-[6px] rounded-full h-[18px] w-[18px] flex items-center justify-center bg-[#81ADA2]">
        <span class="loading loading-spinner h-[14px] w-[14px] bg-green-600" />
      </div>
    </div>
  );
};

export default FallbackLoading;
