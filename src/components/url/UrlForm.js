import React, {useEffect, useState} from 'react';
import './UrlForm.css';
import {Form} from "react-bootstrap";
import CategorySrv from "../../services/CategoryService";
import {filter} from "rxjs";
import CategorySelect from "../category-select/CategorySelect";

function UrlForm(props) {

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" defaultValue={props.name}
                  onChange={(event) => {
                      if(props.onChange) props.onChange({name: event.target.value});
                  }} />
                <Form.Text className="text-muted">
                    Name of URL
                </Form.Text>
                <p className={(props.errors?.name ? 'text-danger':'') + ' app-form-error'}>{props.errors?.name}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicUrl">
                <Form.Label>Url</Form.Label>
                <Form.Control type="text" placeholder="Enter url" defaultValue={props.url}
                    onChange={(event) => {
                        if(props.onChange) props.onChange({url: event.target.value});
                    }} />
                <Form.Text className="text-muted">
                    Address of URL
                </Form.Text>
                <p className={(props.errors?.url ? 'text-danger':'') + ' app-form-error'}>{props.errors?.url}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicShare">
                <Form.Label style={{'display': 'inline', 'marginRight': '1em'}}>Share</Form.Label>
                <Form.Check style={{'display': 'inline', 'marginRight': '1em'}}
                    type="checkbox" placeholder="Share" defaultChecked={props.shared}
                    onChange={(event) => {
                        if(props.onChange) props.onChange({shared: event.target.checked});
                    }} />
                <Form.Text className="text-muted" style={{'display': 'block'}}>
                    Share this url on your profile
                </Form.Text>
            </Form.Group>

            <CategorySelect label="Category" placeholder="Select a category of url" controlId="formBasicCateg"
                            defaultValue={props.category_name} errors={props.errors.category_uuid}
                            onChange={(value) => props.onChange(value.uuid !== undefined ? {category_uuid: value.uuid} : {category_name: value.name})}
            />

        </Form>
    );
}

export default UrlForm;
