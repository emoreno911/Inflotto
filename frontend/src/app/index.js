import React from 'react';
import { NotificationProvider } from 'web3uikit';
import Home from './home';
import DataContextProvider from './context';

function App() {
  return (
    <NotificationProvider>
      <DataContextProvider>
          <Home />
      </DataContextProvider>
    </NotificationProvider>
  );
}

export default App;