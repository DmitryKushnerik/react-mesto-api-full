import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthUserContext } from "../contexts/AuthUserContext";

const ProtectedRoute = ({ component: Component, ...props }) => {
  const value = useContext(AuthUserContext);
  return (
    <Route>
      {() =>
        value.loggedIn ? <Component {...props} /> : <Redirect to="./sign-in" />
      }
    </Route>
  );
};

export default ProtectedRoute; 
