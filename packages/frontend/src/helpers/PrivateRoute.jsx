import { useKeycloak } from "@react-keycloak/web";

const PrivateRoute = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Cargando autenticación...
      </div>
    );
  }


  if (keycloak && keycloak.authenticated) {
    return children;
  }

 
  if (keycloak && typeof keycloak.login === "function") {
    keycloak.login();
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      Redirigiendo al login...
    </div>
  );
};

export default PrivateRoute;