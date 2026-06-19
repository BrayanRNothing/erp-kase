import { BentoLayout } from './components/layout/BentoLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { InventoryProvider } from './context/InventoryContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { ActivityProvider } from './context/ActivityContext';
import { Toaster } from 'react-hot-toast';

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a simple spinner

  return (
    <>
      <Toaster position="top-right" />
      {/* Solid light background */}
      <div className="fixed inset-0 w-full h-full bg-slate-100 -z-10" />

      {user ? <BentoLayout /> : <LoginScreen />}
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ActivityProvider>
          <FinanceProvider>
            <InventoryProvider>
              <MainApp />
            </InventoryProvider>
          </FinanceProvider>
        </ActivityProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
