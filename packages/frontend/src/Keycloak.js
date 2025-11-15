import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8088",
  realm: "tiendaSol",
  clientId: "tiendaSol",
});

export const getUserId = () => keycloak.tokenParsed?.sub;

export default  keycloak;
