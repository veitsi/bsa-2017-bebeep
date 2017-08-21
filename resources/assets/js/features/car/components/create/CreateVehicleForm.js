import React from 'react';
import Select from 'react-select';
import {VehicleService} from '../../services/VehicleService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default class CreateVehicleContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: {
                id_car_mark: null,
                name: null
            },
            model: {
                id_car_model: null,
                id_car_mark: null,
                name: null,
                disabled: true
            },
            color: {
                id: null,
                color: null
            }
        };

        this.getBrandOptions = VehicleService.getBrandOptions;
        this.getModelOptions = VehicleService.getModelOptions;
        this.getColorOptions = VehicleService.getColorOptions;
        this.handleBrandChange = this.handleBrandChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    handleBrandChange(data) {
        console.log(data);

        this.setState({
            brand: {
                id_car_mark: (data) ? data.id_car_mark : null,
                name: (data) ? data.name : null
            },
            model: {
                id_car_mark: (data) ? data.id_car_mark : null,
                disabled: (data) ? false : true
            }
        });
    }

    handleModelChange(data) {
        console.log(data);

        this.setState({
            model: {
                id_car_model: (data) ? data.id_car_model : null,
                name: (data) ? data.name : null
            }
        });
    }

    handleColorChange(data) {
        console.log(data);

        this.setState({
            color: {
                id: (data) ? data.id : null,
                color: (data) ? data.color : null
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
                        <Select.Async
                            name="model"
                            placeholder="Select Car Model"
                            value={this.state.model.name}
                            valueKey="name"
                            labelKey="name"
                            className="col-sm-8"
                            disabled={this.state.model.disabled}
                            loadOptions={ this.getModelOptions }
                            onChange={this.handleModelChange}
                            clearable={true}
                        />
                    </div>

                    <div className="form-group row ">
                        <label className="form-control-label text-muted col-sm-4" htmlFor="color">Color</label>
                        <Select.Async
                            name="color"
                            placeholder="Select Car Color"
                            value={this.state.color.color}
                            valueKey="color"
                            labelKey="color"
                            className="col-sm-8"
                            loadOptions={ this.getColorOptions }
                            onChange={this.handleColorChange}
                            clerable={true}
                        />
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