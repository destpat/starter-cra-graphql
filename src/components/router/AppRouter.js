import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { AuthProvider } from '../utils/firebase/Auth';
import PublicLayout from './PublicLayout';
import Login from '../auth/Login';

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <PublicLayout component={Login} exact path="/login" />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
