import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import 'react-calendar/dist/Calendar.css';
import "./app/layout/styles.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
);
