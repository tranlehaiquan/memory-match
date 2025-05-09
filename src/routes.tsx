import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import App from './App';
import { Login } from './components/Login';
import { GameBoard } from './components/GameBoard';

// Create root route
const rootRoute = createRootRoute({
  component: App,
});

// Create child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: GameBoard,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Create route tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);

// Create the router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
}); 