import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"

import AppLayout from "./components/AppLayout";
import store from "./store";

const app=document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <div >
            <AppLayout></AppLayout>
        </div>
    </Provider>
    ,app);
