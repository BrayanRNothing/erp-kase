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
      {/* Dynamic Theme Background */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-indigo-300 via-indigo-100 to-indigo-200 -z-10 transition-colors duration-500" />

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
