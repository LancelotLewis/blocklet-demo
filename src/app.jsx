import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider, create } from '@arcblock/ux/lib/Theme';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { SessionProvider } from './libs/session';
import { translations } from './locales';
import Home from './pages/home';

function App() {
  const theme = create({});
  return (
    <div className="app">
      <LocaleProvider translations={translations} languages={window.blocklet.languages} fallbackLocale="en">
        <ThemeProvider theme={theme}>
          <SessionProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </SessionProvider>
        </ThemeProvider>
      </LocaleProvider>
    </div>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}
