import { toast, ToastOptions } from 'react-toastify';

export type DisplayToastOptions = ToastOptions & { message?: string };

const toastType = {
  error: toast.error,
  warning: toast.warn,
  success: toast.success,
  info: toast.info,
  default: toast.error,
};

export const displayToast = (toastOptions: DisplayToastOptions = {}) => {
  const defaultToastOptions: DisplayToastOptions = {
    type: 'error',
    message: 'Une erreur est survenue, veuillez réessayer.',
    toastId: 'errorToast',
    autoClose: false,
    theme: 'colored',
  };
  const options: DisplayToastOptions = { ...defaultToastOptions, ...toastOptions };
  if (!options.toastId) {
    console.error('please provide a toastId');
    return;
  }

  if (!options.type || !toastType[options.type]) {
    console.error('please provide a valid toast type');
    return;
  }
  return !toast.isActive(options.toastId) && toastType[options.type](options.message, options);
};

export const displayMissingRightToast = () =>
  displayToast({
    message: "Vous n'avez pas le droit d'effectuer cette action",
    type: 'error',
  });
