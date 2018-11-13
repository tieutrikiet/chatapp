import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import browserHistory from './history';
import Chatpage from '../components/chatpage/chatpage';
import Login from '../components/login/login';

const routes = [
    (
        <Route key={'main'} path={'/chat'} exact={true} component={Chatpage} />
    ),
    (
        <Route key={'chatpage'} path={'/chat/:email'} exact={true} component={Chatpage} />
    ),
    (
        <Route key={'login'} path={'/login'} exact={true} component={Login} />
    )
];

const routesRedirect = () => {
    return (
        <Router history={ browserHistory } >
            <Switch>
                {routes}
                <Redirect from="/" to="/login" />
            </Switch>
        </Router>
    );
};


export default routesRedirect;