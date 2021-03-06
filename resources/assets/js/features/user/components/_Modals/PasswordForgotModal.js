import React from 'react';
import {localize} from 'react-localize-redux';

import LangService from 'app/services/LangService';
import {UserValidator} from 'app/services/UserService';

import * as lang from 'features/user/lang/_Modals/PasswordForgotModal.locale.json';
import Input from 'app/components/Input';
import Modal from 'app/components/Modal';
import { simpleRequest } from 'app/services/RequestService';

import 'features/user/styles/password_forgot.scss';


class PasswordForgotModal extends React.Component {
    constructor() {
        super();
        this.state = {
            formIsOpen: false,
            alertIsOpen: false,
            errors: {}
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        LangService.addTranslation(lang);
    }

    onSubmit(e) {
        e.preventDefault();
        const email = e.target['forgotten_email'].value,
            error = UserValidator.email(email);
        if (!error.valid) {
            this.setState({
                errors: { email: error.error }
            });
        } else {
            simpleRequest.post('/api/v1/password-resets', {
                email: email
            }).then(
                response => this.setState({
                    alertIsOpen: true,
                    formIsOpen: false,
                    errors: {}
                }),
                error => this.setState({
                    errors: error.response.data
                })
            );
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.state.formIsOpen !== newProps.isOpen) {
            this.setState({formIsOpen: newProps.isOpen});
        }
    }

    render() {
        const {errors, formIsOpen, alertIsOpen} = this.state,
            {translate} = this.props;
        const onClosed = this.props.onClosed || (() => {});
        return (
            <div>
                <Modal isOpen={formIsOpen} onClosed={() => { this.state.formIsOpen = false; onClosed(); }}>
                    <form method="post" action="/api/password/forgot" className="password-form" onSubmit={this.onSubmit} autoComplete="false">
                        <div className="modal-header">{translate('password_forgot_modal.enter_your_email_and_we_will_send_link')}</div>
                        <div className="modal-body">
                            <Input
                                name="forgotten_email"
                                type="email"
                                id="email"
                                error={errors.email}
                            >{translate('password_forgot_modal.email')}</Input>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-warning mr-2" role="button" onClick={(e) => {
                                e.preventDefault();
                                this.setState({formIsOpen: false});
                            }}>{translate('password_forgot_modal.cancel')}</button>
                            <button className="btn btn-primary" role="button">{translate('password_forgot_modal.send_password_reset_email')}</button>
                        </div>
                    </form>
                </Modal>
                <Modal isOpen={alertIsOpen} onClosed={() => { this.state.alertIsOpen = false; onClosed(); }}>
                    <div className={"alert alert-success password-alert-success"}>
                        <button type="button" className="close" onClick={(e) => {
                            e.preventDefault();
                            this.setState({alertIsOpen: false});
                        }}>
                            <span>&times;</span>
                        </button>
                        {translate('password_forgot_modal.link_to_reset_password_send_to_your_email')}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default localize(PasswordForgotModal, 'locale');
