import { formatNumber } from "@/utils/format-number";
import { ActionButton } from "@/features/shared";

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export function OrderSummary({ subtotal, tax, total, onCheckout, disabled }: OrderSummaryProps) {
  return (
    <div className="rounded-[10px] border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-3">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-dark-5">Subtotal</span>
          <span className="font-medium text-dark dark:text-white">Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-5">PPN (11%)</span>
          <span className="font-medium text-dark dark:text-white">Rp {tax.toLocaleString("id-ID")}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-stroke pt-4 dark:border-dark-3">
          <span className="text-lg font-bold text-dark dark:text-white">Total</span>
          <span className="text-2xl font-bold tracking-tight text-secondary">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <ActionButton
        onClick={onCheckout}
        disabled={disabled}
        variant="primary"
        label="Bayar Sekarang (Checkout)"
        className="w-full py-4 text-lg"
      />
      
      <p className="mt-3 text-center text-[10px] text-dark-5 dark:text-dark-6">
        Nota akan otomatis digenerate setelah pembayaran berhasil.
      </p>
    </div>
  );
}
