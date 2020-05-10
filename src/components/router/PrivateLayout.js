import React from 'react';
import { Route } from 'react-router-dom';

const PrivateLayout = ({ component: Component, user, ...rest }) => {
  return (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
  );
};

export default PrivateLayout;
