// emailForSignIn

export const setEmailForSignIn = (email: string) =>
  window.localStorage.setItem('emailForSignIn', email);

export const getEmailForSignIn = (): string => {
  const email = window.localStorage.getItem('emailForSignIn');
  if (email) return email;
  // eslint-disable-next-line no-alert
  return window.prompt('メールアドレスを入力してください。');
};

export const clearEmailForSignIn = () =>
  window.localStorage.removeItem('emailForSignIn');