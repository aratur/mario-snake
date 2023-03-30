import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Game from './pages/Game';
import { StoreContextProvider } from './store/storeInstance';
import Loader from './components/Loader';

const GameOverLazy = React.lazy(() => import('./features/GameOver/GameOver'));

const router = createBrowserRouter([
  { path: '/', element: <Game /> },
  {
    path: '/gameOver',
    element: (
      <Suspense fallback={<Loader />}>
        <GameOverLazy />
      </Suspense>
    ),
  },
]);

const App = () => (
  <StoreContextProvider>
    <RouterProvider router={router} />
  </StoreContextProvider>
);

export default App;
