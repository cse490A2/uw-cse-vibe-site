import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const basePath = (import.meta.env.BASE_URL || "/").replace(/^\//, "").replace(/\/$/, "");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    ...(basePath ? { basepath: `/${basePath}` } : {}),
  });

  return router;
};
