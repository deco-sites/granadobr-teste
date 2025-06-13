import ButtonHeader from "site/components/header/Buttons/ButtonHeader.tsx";
interface WishlistProps {
  wishlistText?: string;
}

function Wishlist({ wishlistText }: WishlistProps) {
  return (
    <a
      className={`flex items-center ${
        !wishlistText
          ? "w-[30px] justify-evenly text-xs font-thin"
          : "w-fit text-sm"
      }  h-[30px]`}
      href="/wishlist"
      aria-label="Wishlist"
    >
      <ButtonHeader
        iconId="Heart"
        iconSize={30}
        iconStrokeWidth={0.01}
        ariaLabel="Wishlist"
        className="flex gap-1"
      />
      {wishlistText && (
        <span class={`ml-2 text-lg font-normal font-matria`}>
          {wishlistText}
        </span>
      )}
    </a>
  );
}

export default Wishlist;
