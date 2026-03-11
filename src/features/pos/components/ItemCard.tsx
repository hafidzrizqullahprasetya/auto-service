import Image from "next/image";
import { Item } from "@/types/inventory";
import { formatNumber } from "@/utils/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";

interface ItemCardProps {
  item: Item;
  onAdd: (item: Item) => void;
}

export function ItemCard({ item, onAdd }: ItemCardProps) {
  return (
    <div 
      className="flex flex-col rounded-lg border border-stroke bg-white overflow-hidden shadow-sm hover:border-primary/30 dark:border-dark-3 dark:bg-dark-2 cursor-pointer"
      onClick={() => onAdd(item)}
    >
      <div className="relative h-32 w-full bg-gray-2 dark:bg-dark-3">
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-2 text-dark-5 dark:bg-dark-3">
            <Icons.Inventory size={32} className="opacity-20 mb-1" />
            <span className="text-[10px] font-medium opacity-50">No Image</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
            <Badge variant={item.category === "Service" ? "warning" : "primary"} className="text-[10px] shadow-sm">
                {item.category}
            </Badge>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-mono text-dark-5 dark:text-dark-6">{item.sku}</span>
          </div>
          <h5 className="text-sm font-bold text-dark dark:text-white line-clamp-2 min-h-[2.5rem]">
            {item.name}
          </h5>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-bold text-secondary">
            Rp {formatNumber(item.price)}
          </span>
          {item.stock !== undefined && (
            <span className="text-[10px] font-medium text-dark-5 bg-gray-2 dark:bg-dark-3 px-1.5 py-0.5 rounded">
              Stok: {item.stock}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
