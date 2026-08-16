export const withRedirects = async function redirects() {
  return [
    {
      source: '/',
      destination: '/files',
      permanent: false,
    },
    {
      source: '/root',
      destination: '/files',
      permanent: false,
    },
  ];
};
