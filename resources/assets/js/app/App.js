import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Preloader from './components/Preloader';
import MainHeader from './components/MainHeader';
import Notifications from './components/Notifications';

import AuthService from './services/AuthService';

import { getCountUnread } from './services/NotificationService';
import { setCountUnreadNotifications } from 'features/notifications/actions';

import './bootstrap/bootstrap.scss';
import './bootstrap/font-awesome.scss';
import './styles/app.scss';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShowContent: false,
        }

        this.onAuthSuccess = this.onAuthSuccess.bind(this);
        this.onAuthError = this.onAuthError.bind(this);
        this.setShowContent = this.setShowContent.bind(this);
    }

    componentWillMount() {
        if (AuthService.isAuthorized()) {
            this.onAuthSuccess();
            return;
        }

        if (!AuthService.isSessionTokenValid()) {
            this.setShowContent();
            return;
        }

        AuthService.getSessionDataFromServer(this.onAuthSuccess, this.onAuthError);
    }

    componentWillReceiveProps() {
        if (AuthService.isAuthorized()) {
            this.onAuthSuccess();
            return;
        }

        if (!AuthService.isSessionTokenValid()) {
            this.setShowContent();
            return;
        }
    }

    setShowContent() {
        this.setState({
            isShowContent: true,
        });
    }

    onAuthSuccess() {
        const { setCountUnreadNotifications } = this.props;

        this.setShowContent();

        getCountUnread().then(response => {
            setCountUnreadNotifications(response.data);
        });
    }

    onAuthError() {
        this.setShowContent();
    }

    renderComponent() {
        return !this.state.isShowContent
            ? <Preloader enable={true} />
            : <div>
                {this.props.children}
                <Notifications userId={AuthService.getUserId()} />
            </div>;
    }

    render() {
        return (
            <div id="application">
                <MainHeader />
                { this.renderComponent() }
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch =>
        bindActionCreators({ setCountUnreadNotifications }, dispatch)
)(App);
