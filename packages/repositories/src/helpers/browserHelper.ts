export const setEmailForSignIn = (email: string) =>
  window.localStorage.setItem('emailForSignIn', email);

export const getEmailForSignIn = (): string => {
  const email =
    window.localStorage.getItem('emailForSignIn') ??
    // eslint-disable-next-line no-alert
    window.prompt('メールアドレスを入力してください。') ??
    '';
  setEmailForSignIn(email);
  return email;
};

export const clearEmailForSignIn = () =>
  window.localStorage.removeItem('emailForSignIn');

export const currentUrl = () => window.location.href;

export const oobCode = () =>
  new URLSearchParams(window.location.search).get('oobCode') || '';