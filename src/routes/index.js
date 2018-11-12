import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import browserHistory from './history';
import Chatpage from '../components/chatpage/chatpage';

const routes = [
    (
        <Route key={'chatpage'} path={'/chat/:email'} exact={true} component={Chatpage} />
    ),
    (
        <Route key={'main'} path={'/main'} exact={true} component={Chatpage} />
    )
];

const routesRedirect = () => {
    return (
        <Router history={ browserHistory } >
            <Switch>
                {routes}
                <Redirect from="/" to="/main" />
            </Switch>
        </Router>
    );
};


export default routesRedirect;