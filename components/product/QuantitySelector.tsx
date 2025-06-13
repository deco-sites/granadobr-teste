import { useModal } from "site/islands/ModalProvider.tsx";

export interface Props {
  disabled?: boolean;
  loading?: boolean;
}

const QUANTITY_MAX_VALUE = 100;

function QuantitySelector({ disabled, loading }: Props) {
  const { quantity, setQuantity } = useModal();

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < QUANTITY_MAX_VALUE) {
      setQuantity(quantity + 1);
    }
  };

  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newQuantity = Math.min(
      Math.max(1, parseInt(target.value, 10)),
      QUANTITY_MAX_VALUE,
    );
    setQuantity(newQuantity);
  };

  return (
    <div className="quantity-selector border rounded h-[56px] w-[120px] items-center justify-between">
      <button
        className="btn-square btn-ghost hover:bg-transparent text-2xl w-1/5 h-full"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1 || loading}
        aria-label="Diminuir quantidade"
      >
        -
      </button>
      <input
        className="input text-center text-2xl font-normal w-1/2 h-full mx-1 p-0 font-matria"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        max={QUANTITY_MAX_VALUE}
        min={1}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled || loading}
        aria-label="Quantidade do produto"
        style={{
          MozAppearance: "textfield",
        }}
      />
      <button
        className="btn-square btn-ghost hover:bg-transparent text-2xl w-1/5 h-full"
        onClick={handleIncrement}
        disabled={disabled || quantity >= QUANTITY_MAX_VALUE || loading}
        aria-label="Aumentar quantidade"
      >
        +
      </button>
      <style jsx>
        {`
        /* Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}
      </style>
    </div>
  );
}

export default QuantitySelector;
