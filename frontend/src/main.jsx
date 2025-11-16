import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import Admin from './Admin.jsx';
import Sales from './Sales.jsx';

// Import our new styles
import './index.css'

// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is now the layout
    children: [
      {
        index: true, // Default child route
        element: <Sales />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)