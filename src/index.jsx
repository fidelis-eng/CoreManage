import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ChakraProvider theme={theme}>
        <BrowserRouter>
            <React.StrictMode>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <App />
            </React.StrictMode>
        </BrowserRouter>
    </ChakraProvider>
);
