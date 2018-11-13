import { isNaN } from '@thi.ng/checks/is-nan';

export const enumNames = e => Object.keys(e).filter(v => isNaN(+v));