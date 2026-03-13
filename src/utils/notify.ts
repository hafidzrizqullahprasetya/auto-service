import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
export const Notify = {
  alert: (title: string, text: string, icon: SweetAlertIcon = "error", width: string = "400px") => {
    return MySwal.fire({
      title,
      text,
      icon,
      width,
      confirmButtonText: "Tutup",
      confirmButtonColor: icon === "error" ? "#EF4444" : "#3C50E0",
      didOpen: () => {
        const container = Swal.getContainer();
        if (container) {
          container.style.zIndex = "100000";
        }
      },
      showClass: {
        popup: icon === "error" ? "animate-fade-subtle-in" : "animate-fade-in", 
        backdrop: "swal2-backdrop-show",
        icon: "swal2-icon-show"
      },
      hideClass: {
        popup: icon === "error" ? "animate-fade-subtle-out" : "animate-fade-out", 
      },
      customClass: {
        popup: "dark:bg-dark-2 dark:text-white rounded-xl border border-stroke dark:border-dark-3",
        title: "text-dark dark:text-white text-xl",
        htmlContainer: "text-dark-5 dark:text-dark-6 text-sm",
      },
    });
  },

  toast: (title: string, icon: SweetAlertIcon = "success", position: any = "top") => {
    return MySwal.fire({
      toast: true,
      position: position,
      icon,
      title,
      iconColor: "white",
      background: icon === "error" ? "#EF4444" : icon === "warning" ? "#F59E0B" : icon === "info" ? "#3B82F6" : "#10B981", 
      color: "#ffffff",     
      showConfirmButton: false,
      showCloseButton: icon === "error",
      timer: icon === "error" ? undefined : 3000,
      timerProgressBar: icon !== "error",
      width: "auto",
      didOpen: () => {
        const container = Swal.getContainer();
        if (container) {
          container.style.zIndex = "100000";
        }
      },
      showClass: {
        popup: icon === "error" ? "animate-fade-subtle-in" : "animate-fade-in", 
        backdrop: "swal2-backdrop-show",
        icon: "swal2-icon-show"
      },
      hideClass: {
        popup: icon === "error" ? "animate-fade-subtle-out" : "animate-fade-out", 
      },
      customClass: {
        popup: `${position === 'top-end' ? 'mt-24 mr-4' : 'mt-4'} !rounded-lg shadow-lg !py-3 !px-4 !flex !items-center`,
        icon: "!m-0 !mr-3 !ml-1 !border-none !flex-shrink-0",
        title: "!m-0 !p-0 text-sm font-medium", 
      },
    });
  },

  confirm: async (title: string, text: string, confirmText: string = "Ya, Lanjutkan") => {
    const result = await MySwal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      width: "400px",
      confirmButtonColor: "#EF4444", 
      cancelButtonColor: "#64748B", 
      confirmButtonText: confirmText,
      cancelButtonText: "Batal",
      didOpen: () => {
        const container = Swal.getContainer();
        if (container) {
          container.style.zIndex = "100000";
        }
      },
      customClass: {
        popup: "dark:bg-dark-2 dark:text-white rounded-xl border border-stroke dark:border-dark-3",
        title: "text-dark dark:text-white text-xl",
        htmlContainer: "text-dark-5 dark:text-dark-6 text-sm",
      },
    });
    return result.isConfirmed;
  },

  loading: (title: string = "Memproses...") => {
    return MySwal.fire({
      title,
      width: "320px",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        MySwal.showLoading();
        const container = MySwal.getContainer();
        if (container) {
          container.style.zIndex = "100001";
        }
      },
      customClass: {
        popup: "dark:bg-dark-2 dark:text-white rounded-xl border border-stroke dark:border-dark-3",
        title: "text-dark dark:text-white text-lg font-bold",
      },
    });
  },

  close: () => {
    MySwal.close();
  },
};
