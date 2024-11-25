export const getToken = () => {
  const token = localStorage.getItem("authToken");
  return token;
};
export const tokenLoader = () => {
    const token = getToken();
    return token ? token : null; 
  };
