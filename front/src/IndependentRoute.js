// IndependentRoute.js
import React from 'react';
import { Route } from 'react-router-dom';

const IndependentRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Component {...props} />
      )}
    />
  );
};

export default IndependentRoute;
