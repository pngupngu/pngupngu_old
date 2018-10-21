import { ISubscribable } from '@thi.ng/rstream/api';
import { Subscription } from '@thi.ng/rstream/subscription';

export function takeUntil<A, B>(side: ISubscribable<B>, id?: string): Subscription<A, A> {
  return new TakeUntil(side, id);
}

export class TakeUntil<A, B> extends Subscription<A, A> {

  sideSub: Subscription<B, B>;

  constructor(side: ISubscribable<B>, id?: string) {
    super(null, null, null, id || `takeuntil-${Subscription.NEXT_ID++}`);
    const $this = this;
    this.sideSub = side.subscribe({
      next() {
        setTimeout(() => $this.unsubscribe());
      },
      done() {
        $this.done();
      }
    });
  }

  unsubscribe(sub?: Subscription<any, any>) {
    const res = super.unsubscribe(sub);
    if (!sub || !this.subs.length) {
      this.sideSub.unsubscribe();
    }
    return res;
  }

  done() {
    super.done();
    this.sideSub.unsubscribe();
  }
}