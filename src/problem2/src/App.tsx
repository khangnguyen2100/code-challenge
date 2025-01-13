import React from 'react';
import SwapTokenForm from './components/SwapTokenForm/SwapTokenForm';
import DefaultLayout from './layouts/DefaultLayout';

const App: React.FC = () => {
  return (
    <DefaultLayout>
      <SwapTokenForm />
    </DefaultLayout>
  );
}

export default App;
