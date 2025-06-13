import Icon from "../ui/Icon.tsx";
import Button from "../ui/Button.tsx";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

interface Props {
  quantity: number;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (quantity: number) => void;
}

const QUANTITY_MAX_VALUE = 100;

function QuantitySelector({ onChange, quantity, disabled, loading }: Props) {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const debounceTimer = useRef<any>(null);

  // Update localQuantity if parent changes it externally
  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  // Debounced onChange
  useEffect(() => {
    if (localQuantity === quantity) return;
    if (!onChange) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange(localQuantity);
    }, 500); // 500ms debounce
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [localQuantity]);

  const decrement = useCallback(() => {
    setLocalQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const increment = useCallback(() => {
    setLocalQuantity((prev) => Math.min(prev + 1, QUANTITY_MAX_VALUE));
  }, []);

  const handleInputBlur = (e: any) => {
    let value = e.currentTarget.valueAsNumber;
    if (isNaN(value)) value = 1;
    value = Math.max(1, Math.min(value, QUANTITY_MAX_VALUE));
    setLocalQuantity(value);
  };

  return (
    <div class="join border border-gray-200 bg-white rounded w-[90px]">
      <Button
        onClick={decrement}
        aria-label="Decrementar quantidade"
        class="btn-ghost border-0 p-2 join-item h-8 min-h-8 hover:bg-white"
        disabled={disabled || localQuantity === 1}
        loading={loading}
      >
        <Icon id="Minus" size={13} strokeWidth={0.01} />
      </Button>

      <label for="quantity" class="hidden">Quantidade do produto</label>

      <input
        min={1}
        id="quantity"
        type="number"
        pattern="[0-9]*"
        inputMode="numeric"
        class="h-8 join-item grow outline-none text-sm text-center disabled:bg-white disabled:text-gray-600"
        onBlur={handleInputBlur}
        aria-label="Quantidade do produto"
        max={QUANTITY_MAX_VALUE}
        disabled={disabled}
        value={localQuantity}
        maxLength={3}
        size={3}
      />

      <Button
        onClick={increment}
        aria-label="Incrementar quantidade"
        class="btn-ghost border-0 p-2 join-item h-8 min-h-8 hover:bg-white"
        disabled={disabled}
        loading={loading}
      >
        <Icon id="Plus" size={13} strokeWidth={0.01} />
      </Button>
    </div>
  );
}

export default QuantitySelector;
