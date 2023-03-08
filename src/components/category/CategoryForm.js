import React, {useCallback, useReducer, useRef, useState} from 'react';
import './CategoryForm.css';
import {Form} from "react-bootstrap";
import CategorySelect from "../category-select/CategorySelect";

function CategoryForm(props) {

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" defaultValue={props.name}
                  onChange={(event) => {
                    if(props.onChange) props.onChange({name: event.target.value});
                  }} />
                <Form.Text className="text-muted">
                    Name of category
                </Form.Text>
                <p className={(props.errors?.name ? 'text-danger':'') + ' app-form-error'}>{props.errors?.name}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Enter description" defaultValue={props.description}
                  onChange={(event) => {
                    if(props.onChange) props.onChange({description: event.target.value});
                  }} />
                <Form.Text className="text-muted">
                    Description of category
                </Form.Text>
                <p className={(props.errors?.description ? 'text-danger':'') + ' app-form-error'}>{props.errors?.description}</p>
            </Form.Group>

            <CategorySelect label="Parent Category" placeholder="Select parent category" controlId="parentCateg"
                            defaultValue={props.parent_name} errors={props.errors.parent_uuid}
                            onChange={(value) => props.onChange(value.uuid !== undefined ? {parent_uuid: value.uuid} : {parent_name: value.name})}
            />

            <Form.Group className="mb-3" controlId="formBasicPath">
                <Form.Label>Path</Form.Label>
                <Form.Control type="text" placeholder="Enter path" defaultValue={props.path}
                  onChange={(event) => {
                    if(props.onChange) props.onChange({path: event.target.value});
                  }} />
                <Form.Text className="text-muted">
                    Category path
                </Form.Text>
                <p className={(props.errors?.path ? 'text-danger':'') + ' app-form-error'}>{props.errors?.path}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicShare">
                <Form.Label style={{'display': 'inline', 'marginRight': '1em'}}>Share</Form.Label>
                <Form.Check style={{'display': 'inline', 'marginRight': '1em'}}
                    type="checkbox" placeholder="Share" defaultChecked={props.shared}
                    onChange={(event) => {
                      if(props.onChange) props.onChange({shared: event.target.checked});
                    }} />
                <Form.Text className="text-muted" style={{'display': 'block'}}>
                    Share this category on your profile
                </Form.Text>
            </Form.Group>
        </Form>
    );
}

export default CategoryForm;
