import { Item } from "@/mock/inventory";
import { Icons } from "@/components/icons";
import { formatNumber } from "@/lib/format-number";

interface CartItem {
  item: Item;
  quantity: number;
}

interface CartItemRowProps {
  cartItem: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ cartItem, onUpdateQty, onRemove }: CartItemRowProps) {
  const { item, quantity } = cartItem;

  return (
    <div className="flex items-center justify-between border-b border-stroke py-3 last:border-0 dark:border-dark-3">
      <div className="flex-1 pr-4">
        <h6 className="text-sm font-bold text-dark dark:text-white line-clamp-1">
          {item.name}
        </h6>
        <p className="text-xs text-dark-5 dark:text-dark-6">
          Rp {item.price.toLocaleString("id-ID")} x {quantity}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-stroke dark:border-dark-3 bg-gray-2 dark:bg-dark-3">
          <button 
            className="px-2 py-1 text-dark dark:text-white hover:bg-stroke dark:hover:bg-dark-4 disabled:opacity-30"
            onClick={() => onUpdateQty(item.id, -1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-dark dark:text-white">
            {quantity}
          </span>
          <button 
            className="px-2 py-1 text-dark dark:text-white hover:bg-stroke dark:hover:bg-dark-4"
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
