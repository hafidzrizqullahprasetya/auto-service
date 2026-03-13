import { Item } from "@/types/inventory";
import { Icons } from "@/components/Icons";
import { formatNumber } from "@/utils/format-number";

interface CartItem {
  item: Item;
  quantity: number;
}

interface CartItemRowProps {
  cartItem: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({
  cartItem,
  onUpdateQty,
  onRemove,
}: CartItemRowProps) {
  const { item, quantity } = cartItem;

  return (
    <div className="flex items-center justify-between border-b border-stroke py-3 last:border-0 dark:border-dark-3">
      <div className="flex-1 pr-4">
        <h6 className="line-clamp-1 text-sm font-bold text-dark dark:text-white">
          {item.name}
        </h6>
        <p className="text-xs text-dark-5 dark:text-dark-6">
          Rp {formatNumber(item.price)} x {quantity}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-3">
          <button
            className="px-2 py-1 text-dark hover:bg-stroke disabled:opacity-30 dark:text-white dark:hover:bg-dark-4"
            onClick={() => onUpdateQty(item.id, -1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-dark dark:text-white">
            {quantity}
          </span>
          <button
            className="px-2 py-1 text-dark hover:bg-stroke dark:text-white dark:hover:bg-dark-4"
            onClick={() => onUpdateQty(item.id, 1)}
          >
            +
          </button>
        </div>

        <button
          className="text-dark-5 hover:text-red"
          onClick={() => onRemove(item.id)}
        >
          <Icons.Delete size={20} />
        </button>
      </div>
    </div>
  );
}
