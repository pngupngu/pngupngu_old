import { isNumber } from '@thi.ng/checks/is-number';

export function foo() {
  console.log('core', isNumber(100));
}