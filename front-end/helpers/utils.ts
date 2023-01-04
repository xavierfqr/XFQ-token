export const shortenAddress = (account: string) => {
  return `${account.substring(0, 5)}...${account.substring(account.length - 4, account.length)}`;
};
