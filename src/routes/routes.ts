import type IRoutes from "./IRoutes";
import routesSite from "./routesSite";
import routesAuth from "./routesAuth";
import routesAdmin from "./routesAdmin";

const routes: IRoutes[] = [...routesSite, ...routesAuth, ...routesAdmin];

export default routes;
