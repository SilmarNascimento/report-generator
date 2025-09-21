import { Bounce, toast } from "react-toastify";

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

export function infoAlert(message: string) {
  return toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
    style: {
      fontSize: "1rem",
      backgroundColor: "#FFF8E1", 
      border: "2px solid #FFD54F",
      color: "#45464F",
    },
    icon: () => (
      <span className="material-symbols-outlined text-yellow-700">info</span>
    ),
  });
}
