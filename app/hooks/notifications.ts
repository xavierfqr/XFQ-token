import { useNotification } from '@web3uikit/core';

export function useErrorNotification() {
  const dispatch = useNotification();

  const handleErrorNotification = (message: string) => {
    dispatch({
      type: 'error',
      message,
      title: 'Error',
      position: 'topR',
    });
  };

  return handleErrorNotification;
}

export function useWarningNotification() {
  const dispatch = useNotification();

  const handleErrorNotification = (message: string) => {
    dispatch({
      type: 'warning',
      message,
      title: 'Warning',
      position: 'topR',
    });
  };

  return handleErrorNotification;
}

export function useSuccessNotification() {
  const dispatch = useNotification();

  const handleSuccessNotification = (message: string) => {
    dispatch({
      type: 'success',
      message,
      title: 'Success',
      position: 'topR',
    });
  };

  return handleSuccessNotification;
}
