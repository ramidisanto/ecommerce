import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();
  const isLoggedIn = keycloak.authenticated;

  if (!isLoggedIn) {
      keycloak.login();
      return null;
  }

  return children;
};

export default PrivateRoute;