import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faXmark, faBars, faTrashCan, faAngleRight, faAngleDown,faCircleInfo, faAngleUp, faHouse, faPlaneDeparture,faBolt } from '@fortawesome/free-solid-svg-icons';
import {faCircleQuestion} from '@fortawesome/free-regular-svg-icons';

library.add( faUser,faXmark, faBars, faTrashCan, faAngleRight,faAngleDown,faCircleInfo, faAngleUp, faHouse, faPlaneDeparture, faBolt, faCircleQuestion);


export default{
    user: faUser,
    angleDown: faAngleDown,
    angleUp: faAngleUp,
    faHouse,
    faPlaneDeparture,
    faBolt,
    faCircleInfo,
    faCircleQuestion,
    faAngleRight,
    faTrashCan,
    faBars,
    faXmark
}

