import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  //   inputEl: document.querySelector('#datetime-picker'),
  buttonEl: document.querySelector('button[data-start]'),
  daysSpan: document.querySelector('[data-days]'),
  hoursSpan: document.querySelector('[data-hours]'),
  minutesSpan: document.querySelector('[data-minutes]'),
  secondsSpan: document.querySelector('[data-seconds]'),
};

refs.buttonEl.setAttribute('disabled', true);
let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < options.defaultDate) {
      refs.buttonEl.setAttribute('disabled', true);
      Notiflix.Notify.warning('Please choose a date in the future');
    } else {
      selectedDate = selectedDates[0];
      refs.buttonEl.removeAttribute('disabled');
    }
  },
};
flatpickr('#datetime-picker', options);

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.onTick = onTick;
  }
  start() {
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const diff = selectedDate - currentTime;
      if (diff <= 0) {
        this.stop();
        return;
      }
      const time = this.convertMs(diff);
      this.onTick(time);
    }, 1000);
  }
  stop() {
    clearInterval(this.intervalId);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTick: updateValue,
});

refs.buttonEl.addEventListener('click', () => {
  timer.start();
});

function updateValue({ days, hours, minutes, seconds }) {
  refs.daysSpan.textContent = `${days}`;
  refs.hoursSpan.textContent = `${hours}`;
  refs.minutesSpan.textContent = `${minutes}`;
  refs.secondsSpan.textContent = `${seconds}`;
}
