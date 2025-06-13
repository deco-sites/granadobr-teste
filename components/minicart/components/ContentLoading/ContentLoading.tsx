const ContentLoading = () => {
  return (
    <div class="absolute inset-0 bg-white/50 z-20">
      <div class="flex items-center justify-center h-full w-full">
        <span class="loading loading-spinner w-11 bg-green-600" />
      </div>
    </div>
  );
};

export default ContentLoading;
