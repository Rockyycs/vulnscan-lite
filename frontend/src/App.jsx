import ScanDetails from "./pages/ScanDetails";
import Scans from "./pages/Scans";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {

  return (

    <Routes>

<Route path="/dashboard" element={<Dashboard />} />

<Route path="/scans" element={<Scans />} />

<Route path="/reports" element={<Reports />} />

<Route path="/analytics" element={<Analytics />} />

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/scan/:id"
        element={<ScanDetails />}
      />

    </Routes>

  );
}

export default App;
