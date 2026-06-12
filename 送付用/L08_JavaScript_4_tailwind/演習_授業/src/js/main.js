'use strict';
const dateDisplay = document.getElementById('js-date-display');
const calendarDisplay = document.getElementById('js-calendar-display');
const prevBtn = document.getElementById('js-prev-btn');
const nextBtn = document.getElementById('js-next-btn');

const openAddEventModalBtn = document.getElementById('js-open-add-event-modal');
const addEventModal = document.getElementById('js-add-event-modal');
const addEventTitle = document.getElementById('js-add-event-title');
const addEventDate = document.getElementById('js-add-event-date');

//モーダルの時刻選択肢を取得
const timeSelect = document.getElementsByClassName('js-time-select');

// モーダルの要素を取得
const editEventModal = document.getElementById('js-edit-event-modal');

// モーダルのタイトルを取得
const editEventTitle = document.getElementById('js-edit-event-title');

// モーダルの日時を取得
const editEventDate = document.getElementById('js-edit-event-date');

const addEventBtn = document.getElementById('js-add-event-btn');

//モーダルの削除ボタンを取得
const deleteEventBtn = document.getElementById('js-delete-event-btn');

//モーダルの編集ボタンを取得
const editEventBtn = document.getElementById('js-edit-event-btn');

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

const week = ['日', '月', '火', '水', '木', '金', '土'];

const firstDate = new Date(currentYear, currentMonth, 1);

let events = [];




let editEventId;

window.addEventListener('load', () => {
  showCalendar();
  showEvents();
  for (let i = 0; i < timeSelect.length; i++) {
    timeSelect[i].innerHTML = createTimes();
  }
});
prevBtn.addEventListener('click', () => {
  firstDate.setMonth(firstDate.getMonth() - 1);
  showCalendar();
  showEvents();
});

nextBtn.addEventListener('click', () => {
  firstDate.setMonth(firstDate.getMonth() + 1);
  showCalendar();
  showEvents();
});

openAddEventModalBtn.addEventListener('click', () => {
  addEventModal.showModal();
});

addEventBtn.addEventListener('click', () => {
  let newId = 1;

  if (events.length) {
    // イベントのIDを生成する
    newId = Math.max(...events.map((item) => item.id)) + 1;
  }

  const eventStartDate = new Date(
    `${addEventDate.value} ${timeSelect[0].value}`
  );
  const eventEndDate = new Date(`${addEventDate.value} ${timeSelect[1].value}`);

  const event = {
    id: newId,
    title: addEventTitle.value,
    startDate: eventStartDate,
    endDate: eventEndDate,
  };

  // イベントを配列に追加する
  events = [...events, event];

  showEvents();
});

const showCalendar = () => {
  // 年と月を表示する
  dateDisplay.textContent = `${firstDate.getFullYear()}年${
    firstDate.getMonth() + 1
  }月`;

  // カレンダーを作成する
  calendarDisplay.innerHTML =
    createWeek() + createDates(firstDate.getFullYear(), firstDate.getMonth());
};

const createWeek = () => {
  let element = '';

  element += `<div class="grid grid-cols-${week.length} border-b border-slate-300">`;
  for (let i = 0; i < week.length; i++) {
    element += `<div class="p-1 text-center ${
      i + 1 === week.length ? '' : 'border-r border-slate-300'
    }">${week[i]}</div>`;
  }
  element += '</div>';

  return element;
};

const createDates = (year, month) => {
  const firstDayOfWeek = firstDate.getDay();
  const lastDateNum = new Date(year, month + 1, 0).getDate();
  const lastDateOfPrevMonthNum = new Date(year, month, 0).getDate();

  const rowNumber = Math.ceil((firstDayOfWeek + lastDateNum) / week.length);

  let dayCount = 1;

  let element = '';

  element += `<div class="grid grid-cols-${week.length} grid-rows-${rowNumber} flex-grow">`;
  for (let i = 0; i < rowNumber * week.length; i++) {
    const borderStyle =
      (i + 1) % week.length === 0
        ? 'border-b border-slate-300'
        : 'border-b border-slate-300 border-r';

    if (i < firstDayOfWeek) {
      element += `<div class="p-1 text-center text-slate-200 ${borderStyle}"><span class="inline-grid place-items-center h-6 mb-2">${
        lastDateOfPrevMonthNum - firstDayOfWeek + i + 1
      }</span></div>`;
    } else if (dayCount > lastDateNum) {
      element += `<div class="p-1 text-center text-slate-200 ${borderStyle}"><span class="inline-grid place-items-center h-6 mb-2">${
        dayCount - lastDateNum
      }</span></div>`;
      dayCount++;
    } else if (
      dayCount === currentDay &&
      year === currentYear &&
      month === currentMonth
    ) {
      element += `<div class="p-1 text-center ${borderStyle} js-active-date"><span class="text-white w-6 h-6 rounded-full bg-blue-600 inline-grid place-items-center mb-2">${dayCount}</span></div>`;
      dayCount++;
    } else {
      element += `<div class="p-1 text-center ${borderStyle} js-active-date"><span class="inline-grid place-items-center h-6 mb-2">${dayCount}</span></div>`;
      dayCount++;
    }
  }
  element += '</div>';

  return element;
};

const createTimes = () => {
  let element = '';

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');

      element += `<option value="${hourStr}:${minuteStr}" ${
        hour === 0 && minute === 0 ? 'selected' : ''
      }>${hourStr}:${minuteStr}</option>`;
    }
  }

  return element;
};

const showEvents = () => {
  const calendarDates = document.getElementsByClassName('js-active-date');

  // 表示するイベントをフィルタリングする
  const filteredEvents = events.filter(
    (event) =>
      event.startDate.getFullYear() === firstDate.getFullYear() &&
      event.startDate.getMonth() === firstDate.getMonth()
  );

  for (let i = 0; i < filteredEvents.length; i++) {
    const event = filteredEvents[i];
    const eventDate = event.startDate.getDate();

    for (let day = 0; day < calendarDates.length; day++) {
      const calendarDate = parseInt(
        calendarDates[day].firstChild.textContent,
        10
      );

      if (eventDate === calendarDate) {
        const startDateHour = event.startDate
          .getHours()
          .toString()
          .padStart(2, '0'); // イベントバッジに表示する時間
        const startDateMinute = event.startDate
          .getMinutes()
          .toString()
          .padStart(2, '0'); // イベントバッジに表示する分

        // ボタン要素を作成する
        const badgeElm = document.createElement('button');
        badgeElm.id = `js-event-label-${event.id}`;
        badgeElm.className =
          'text-3xs md:text-xs text-white font-bold bg-teal-500 rounded p-0.5 md:p-1 mt-1 text-left line-clamp-1 w-full';
        badgeElm.innerHTML = `${startDateHour}:${startDateMinute} ${event.title}`;

        badgeElm.addEventListener('click', () => {
          editEventId = event.id;
          editEventTitle.value = event.title;
          editEventDate.value = `${event.startDate.getFullYear()}-${(
            event.startDate.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}-${event.startDate
            .getDate()
            .toString()
            .padStart(2, '0')}`;
        
          timeSelect[2].value = `${event.startDate
            .getHours()
            .toString()
            .padStart(2, '0')}:${event.startDate
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
        
          timeSelect[3].value = `${event.endDate
            .getHours()
            .toString()
            .padStart(2, '0')}:${event.endDate
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
        
          // イベント編集モーダルを表示する
          editEventModal.showModal();

 

        });

        editEventBtn.addEventListener('click', () => {
          const eventTitle = editEventTitle.value;
          const eventStartDate = new Date(
            `${editEventDate.value} ${timeSelect[2].value}`
          );
          const eventEndDate = new Date(
            `${editEventDate.value} ${timeSelect[3].value}`
          );
          // イベントを編集する
          events = events.map((event) => {
            if (event.id === editEventId) {
              event.title = eventTitle;
              event.startDate = eventStartDate;
              event.endDate = eventEndDate;
            }
        
            return event;
          });
        
          showCalendar();
          showEvents();
        });

        deleteEventBtn.addEventListener('click', () => {
          // イベントを削除する
          events = events.filter((event) => event.id !== editEventId);
        
          showCalendar();
          showEvents();
        });



        // カレンダーの日付要素にボタンを追加する
				calendarDates[day].appendChild(badgeElm);
      }
    }
  }
};

 
