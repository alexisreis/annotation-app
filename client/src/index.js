import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css';
import App from './pages/App';
import Layout from "./components/Layout";
import AnnotoriousViewer from "./pages/AnnotoriousViewer";
import Login from "./pages/Login";
import Test from "./pages/Test";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
                  <Route index element={<App />} />
                  <Route path="image" element={<AnnotoriousViewer />} />
                  <Route path="login" element={<Login />} />
                  <Route path="test" element={<Test />} />
              </Route>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
