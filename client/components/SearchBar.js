import React from 'react';
import { AutoComplete, Button, Input} from 'antd';
import * as SmartyStreetsSDK from "smartystreets-javascript-sdk";
import axios from 'axios';
import { SMARTYSTREETKEY } from '../config';
import {getCookie} from '../actions/auth';
import {API} from '../config';

const Option = AutoComplete.Option;

class SearchBar extends React.Component {
    state = {
        address:{
            street:"",
            city:"", 
            state:"",
        },
        dataSource: [],
    }

    handleSearch = (value) => {

    const SmartyStreetsCore = SmartyStreetsSDK.core;
    const websiteKey = SMARTYSTREETKEY;
    const credentials = new SmartyStreetsCore.SharedCredentials(websiteKey);
    const builder = new SmartyStreetsCore.ClientBuilder(credentials);
    const client = builder.buildUsAutocompleteClient();
    const Lookup = new SmartyStreetsSDK.usAutocomplete.Lookup(value);
    client.send(Lookup)
        .then(response=>{
            this.setState({
                address :{},
                dataSource: !value? [] : response.result});
        })
        .catch(console.warn);
    }

    onSelect = (address) => {
        var street = address.substring(0, address.lastIndexOf(","));
        var rest = address.substring(address.lastIndexOf(",") + 1, address.length);
        var city = rest.substring(0, rest.lastIndexOf(" ") + 1).trim();
        var state = address.substring(address.lastIndexOf(" ") + 1, address.length);
        var address = {
            street,
            city,
            state,
        }
        this.setState({
            address
        })
        
    }

    verifyAddress = ()=>{
        const token = getCookie("token");
        if(!token){
            return "There is no user signed in"
        }
        const config = {
            headers: { Authorization:`Bearer ${token}`}
        }
        axios.post(`${API}/verifyAddress`, this.state.address, config)
            .then(response => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            })
    }
    render() {
        const { dataSource } = this.state;
        const options = dataSource.map((address) => (
            <Option key={address.text} value={address.text}  className="address-option">
                <span className="address-option-label">{address.text}</span>
            </Option>
        ));
        return (
            <div>
                <AutoComplete
                    className="search-bar"
                    size="large"
                    dataSource={options}
                    onSelect={this.onSelect}
                    onSearch={this.handleSearch}
                    placeholder="Input Here"
                    optionLabelProp="value"
                >
                </AutoComplete>
                <div>
                    <button onClick={this.verifyAddress}>Submit Address</button>
                </div>
    
            </div>

            
        );
    }
}

export default SearchBar;
