import React from 'react';
import Select from 'react-select';
import { securedRequest } from '../../../../app/services/RequestService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default class CreateVehicleContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: {
                id_car_mark: null,
                name: null
            }
        };

        this.getBrandOptions = this.getBrandOptions.bind(this);
        this.handleBrandChange = this.handleBrandChange.bind(this)
    }

    getBrandOptions = () => {
        return securedRequest.get(`/api/v1/car-brand`)
            .then((response) => {
                return response.data;
            }).then((json) => {
                return { options: json };
            });
    }

    handleBrandChange(data) {
        console.log(data);

        this.setState({
            brand: {
                id_car_mark: (data !== null) ? data.id_car_mark : null,
                name: (data !== null) ? data.name : null
            }
        });
    }

    render() {
        return (
            <form role="form" className="card vehicle-form" action="/api/v1/car" method="POST">
                <div className="card-header">
                    Enter vehicle details
                </div>
                <div className="card-block">
                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="brand">Car Brand</label>
                        <Select.Async
                            name="brand"
                            placeholder="Select Car Brand"
                            value={this.state.brand.name}
                            valueKey="name"
                            labelKey="name"
                            className="col-sm-8"
                            loadOptions={ this.getBrandOptions }
                            onChange={this.handleBrandChange}
                            clearable={true}
                        />
                    </div>

                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="model">Car Model</label>
                    </div>

                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="color">Color</label>
                    </div>

                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="year">Year</label>
                    </div>

                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="body">Body</label>
                    </div>

                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="seats">Seats</label>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="text-center">
                        <button className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}