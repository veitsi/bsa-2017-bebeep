import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { localize } from 'react-localize-redux';

import PageHeader from 'app/components/PageHeader';

import LangService from 'app/services/LangService';
import * as lang from '../lang/Dashboard.locale.json';

class Dashboard extends React.Component {

    componentWillMount() {
        LangService.addTranslation(lang);
    }

    render() {
        const { user, translate } = this.props,
            userName = `${user.first_name} ${user.last_name}`;

        return (
            <section className="page-section">
                <PageHeader header={ translate('dashboard.header') } />
                <p className="text-center">
                    { translate('dashboard.hello', {username: userName}) }
                </p>
            </section>
        )
    }
}

const DashboardConnected = connect(
    (state) => ({
        user: state.user.profile,
    }),
    null
)(Dashboard);

export default localize(DashboardConnected, 'locale');
