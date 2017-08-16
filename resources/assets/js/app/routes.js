import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import App from './App';

import Home from './layouts/Home';
import NotFound from './layouts/NotFound';

import { RegisterForm, RegisterSuccess, RegisterVerify } from '../features/user/layouts/Register';
import { LoginForm, Logout } from '../features/user/layouts/Login';
import PasswordReset from '../features/user/layouts/PasswordReset';

import Dashboard from '../features/user/layouts/Dashboard';

import SearchIndex from '../features/search/index/layouts/SearchIndex';

import Vehicles from '../features/vehicle/layouts/Vehicles';
import VehicleDetails from '../features/vehicle/layouts/VehicleDetails';

import CreateTrip from '../features/trip/layouts/CreateTrip';

import EditTrip from '../features/trip/layouts/EditTrip';
import TripsList from '../features/trip-list/layouts/TripsList';

import { requireAuth, requireGuest } from '../app/services/AuthService';

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ SearchIndex } />

        <Route onEnter={ requireAuth }>
            <Route path="/dashboard" component={ Dashboard } />

            <Route path="vehicles">
                <IndexRoute component={ Vehicles } />
                <Route path="create" component={ Vehicles } />
                <Route path=":id" component={ VehicleDetails } />
            </Route>

            <Redirect from='trips' to='/trips/upcoming'/>
            <Route path="trips">
                <Route path="upcoming" component={ TripsList } />
                <Route path="past" component={ TripsList } />
            </Route>

            <Route path="trip">
                <Route path="create" component={ CreateTrip } />
                <Route path="edit/:id" component={ EditTrip } />
            </Route>

            <Route path="logout" component={ Logout } />
        </Route>

        <Route onEnter={ requireGuest }>
            <Route path="registration" component={ RegisterForm } />
            <Route path="registration/success" component={ RegisterSuccess } />
            <Route path="verification" component={ RegisterVerify } />

            <Route path="login" component={ LoginForm } />
            <Route path="password/reset" component={ PasswordReset } />
        </Route>

        <Route path="*" component={ NotFound } />
    </Route>
);
