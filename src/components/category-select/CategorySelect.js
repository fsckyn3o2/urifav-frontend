import React, {useCallback, useReducer, useRef, useState} from 'react';
import './CategorySelect.css';
import {Form} from "react-bootstrap";
import CategorySrv from "../../services/CategoryService";
import {debounceTime} from "rxjs";

function CategorySelect(props) {

    const setCategValue = (name, uuid) => {
        setCateg(name);
        //props.onChange({uuid: uuid, name: name});
    };

    const mapCategoryToOption = (item, index) => <li key={item.uuid + index}>{item.name}</li>;
    const notFoundItem = <li key={'_no_option'} className="no-option">Category not found</li>;

    const categInput = useRef(null);
    const categList = useRef(null);

    const [categories, setCategories] = useState([]);
    const [categ, setCateg] = useReducer((state, action) => action, '', () => props.defaultValue);


    const searchCategory = useCallback(txt => {
        CategorySrv.searchByName(txt, 10).pipe(debounceTime(1000)).subscribe({
            next: res => { res.length>0 ? setCategories(res.map(mapCategoryToOption)) : setCategories([notFoundItem]); },
            error: () => setCategories([notFoundItem])
        });
    }, []);

    const selectCategoryInList = (keycode) => {
        const categSelection = categList.current;

        let currentElement = categSelection.querySelector('.mouseover') ||  categSelection.querySelector('li:hover');
        if(categSelection.children.length>0 && categSelection.children[0].classList.contains('no-option')) return;

        if(categSelection.children.length>0 && keycode !== null && keycode !== 'Enter') {

            if (currentElement === null) {
                currentElement = categSelection.children[0];
                currentElement.classList.add('mouseover');
            } else {
                currentElement.classList.remove('mouseover');

                if (keycode === 'ArrowDown' || keycode === 'ArrowRight') {
                    if(currentElement.nextElementSibling !== null) {
                        currentElement.nextElementSibling?.classList.add('mouseover')
                    } else {
                        currentElement.parentElement.querySelector('li:first-child').classList.add('mouseover');
                    }
                } else if (keycode === 'ArrowUp' || keycode === 'ArrowLeft') {
                    if(currentElement.previousElementSibling !== null) {
                        currentElement.previousElementSibling?.classList.add('mouseover');
                    } else {
                        currentElement.parentElement.querySelector('li:last-child').classList.add('mouseover');
                    }
                }
            }
        }

        if(currentElement !== null) {
            if (keycode === null) {
                currentElement.classList.remove('mouseover');
            } else if (keycode === 'Enter'){
                props.onChange({name: currentElement.textContent});
                categInput.current.value = currentElement.textContent;
                currentElement.classList.remove('mouseover');
            }
        }
    };

    return <>
        <Form.Group className="mb-3" controlId={props.controlId}>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control type="text" placeholder={props.placeholder}
                          defaultValue={categ} className="categ-select-input" ref={categInput}
                          onKeyDown={(event) => selectCategoryInList(event.key) }
                          onChange={(event) => searchCategory(event.target.value) }
                          onBlur={(event) => props.onChange({name: event.target.value})}
            />
            <ul className="categ-select-list" ref={categList}
                onMouseEnter={() => selectCategoryInList(null)}
                onMouseDown={(event) => selectCategoryInList('Enter')}>
                {categories}
            </ul>
            <Form.Text className="text-muted">
                {props.placeholder}
            </Form.Text>
            <p className={(props.errors !== undefined ? 'text-danger':'') + ' app-form-error'}>{props.errors}</p>
        </Form.Group>
    </>
}

export default CategorySelect;
