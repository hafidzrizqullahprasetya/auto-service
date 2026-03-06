import { GoogleIcon } from "@/assets/icons";

export default function GoogleSigninButton({ text }: { text: string }) {
  return (
    <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border-2 border-stroke bg-gray-1 p-[15px] text-sm font-bold text-dark transition-none hover:bg-dark hover:text-white dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-white dark:hover:text-dark">
      <GoogleIcon />
      {text}
    </button>
  );
}
