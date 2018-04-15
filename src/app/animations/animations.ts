import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export const fadeInOutAnimation =
    trigger('fadeInOut', [
        transition(':enter', [
	      style({ opacity: 0 }),
	      animate(1000, style({ opacity: 1 }))
	    ]),
	    transition(':leave', [
	      animate(1000, style({ opacity: 0 }))
	    ]),
    ]);

export const snackBarAnimation =
    trigger('snackBarSlide', [
        transition(':enter', [
        style({ opacity: 0, top: '-3em' }),
        animate(100, style({ opacity: 1, top: '1em' }))
      ]),
      transition(':leave', [
        animate(100, style({ opacity: 0, top: '-3em' }))
      ]),
    ]);