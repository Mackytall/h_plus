import { displayToast } from './toastHelper';

type ObjError = {
  error: string;
};

type ObjMessage = {
  message: string;
};

export const showErrorMessage = (error: unknown) => {
  const defaultMessage = 'Un problème est survenu, veuillez réessayer';
  if (typeof error === 'object' && error) {
    if ((error as ObjError).error) {
      displayToast({
        type: 'error',
        message: (error as ObjError).error || defaultMessage,
      });
    } else if ((error as ObjMessage).message) {
      displayToast({
        type: 'error',
        message: (error as ObjMessage).message || defaultMessage,
      });
    }
  } else if (typeof error === 'string') {
    displayToast({
      type: 'error',
      message: error || defaultMessage,
    });
  } else {
    displayToast({
      type: 'error',
      message: defaultMessage,
    });
  }
};
