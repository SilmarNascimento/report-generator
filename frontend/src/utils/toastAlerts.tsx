import { Bounce, toast, type ToastOptions } from "react-toastify";

export function successAlert(message: string) {
  return toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    style: {
      fontSize: "1rem",
      backgroundColor: "#EAFBD7",
      border: "2px solid #ACEA85",
      color: "#45464F",
    },
    icon: () => (
      <span className="material-symbols-outlined text-green-700">
        check_circle
      </span>
    ),
  });
}

export function warningAlert(errorMessage: string) {
  return toast.warn(errorMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    style: {
      fontSize: "1rem",
      backgroundColor: "#FFE4E4",
      border: "2px solid #E45F5F",
      color: "#45464F",
    },
    icon: () => (
      <span className="material-symbols-outlined text-red-700">cancel</span>
    ),
  });
}
export function infoAlert(
  message: string | React.ReactNode,
  opts?: ToastOptions,
) {
  const content =
    typeof message === "string" ? (
      <span className="leading-snug">{message}</span>
    ) : (
      message
    );

  return toast.info(content, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
    className: "!items-start",
    style: {
      fontSize: "1rem",
      lineHeight: 1.25,
      padding: "12px 16px",
      maxWidth: 500,
      backgroundColor: "#FFF6CE",
      border: "2px solid #FFDC6D",
      color: "#45464F",
      ...(opts?.style ?? {}),
    },
    icon: () => (
      <span className="material-symbols-outlined mt-0.5 self-start leading-none text-yellow-600">
        info
      </span>
    ),
    ...opts,
  } as ToastOptions);
}
