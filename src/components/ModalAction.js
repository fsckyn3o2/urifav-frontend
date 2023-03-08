
function ModalAction(state, action) {
    switch(action) {
        default:
            return {...state, ...action};
        case 'show':
            return {...state, show: true};
        case 'hide':
            return {...state, show: false};
    }
}

export default ModalAction;
