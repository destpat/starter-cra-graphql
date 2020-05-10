import React from 'react';
import { Route } from 'react-router-dom';

const PublicLayout = ({ component: Component, user, ...rest }) => {
  return (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} />} />
  );
};

export default PublicLayout;
