import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL, // Esto leerá la URL de la nube o local según el entorno
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
});

export const getUserId = () => keycloak.tokenParsed?.sub;

export default  keycloak;
