import { createHashRouter } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";
import { App } from "../pages/App";
import { Issue } from "../pages/Issue";
import { ProductSelect } from "../pages/ProductSelect";
import { Loading } from "../components/Loading/Loading";

export const router = createHashRouter([
  {
    path: "/",
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <ProductSelect /> },
      { path: "basicInfo", element: <App /> },
      { path: "issue", element: <Issue /> },
      { path: "productSelect", element: <ProductSelect /> },
      { path: "Loading", element: <Loading /> },
    ],
  },
]);

