import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vehicles } from './pages/Vehicles';
import { SinglePrediction } from './pages/SinglePrediction';
import { BatchPrediction } from './pages/BatchPrediction';
import { Analytics } from './pages/Analytics';
import { Model } from './pages/Model';
import { Settings } from './pages/Settings';
import { ToastProvider } from './hooks/useToast';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<Layout />}>
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/vehicles"      element={<Vehicles />} />
            <Route path="/predict"       element={<Navigate to="/predict/single" replace />} />
            <Route path="/predict/single" element={<SinglePrediction />} />
            <Route path="/predict/batch" element={<BatchPrediction />} />
            <Route path="/analytics"    element={<Analytics />} />
            <Route path="/model"         element={<Model />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="*"              element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
