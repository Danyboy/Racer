// Текущая дата
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Переменные для карты
let map = null;
let markers = [];

// Элементы DOM
const calendarDays = document.getElementById('calendarDays');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const modal = document.getElementById('eventModal');
const eventDetails = document.getElementById('eventDetails');
const closeModal = document.querySelector('.close');

// --- Кастомный multiselect ---
const countryOptions = [
    { value: 'Spain', label: translations[getStoredLanguage()].spain, flag: '🇪🇸' },
    { value: 'France', label: translations[getStoredLanguage()].france, flag: '🇫🇷' },
    { value: 'Germany', label: translations[getStoredLanguage()].germany, flag: '🇩🇪' },
    { value: 'Austria', label: translations[getStoredLanguage()].austria, flag: '🇦🇹' },
    { value: 'Czech', label: translations[getStoredLanguage()].czech, flag: '🇨🇿' },
    { value: 'Netherlands', label: translations[getStoredLanguage()].netherlands, flag: '🇳🇱' },
    { value: 'Uk', label: translations[getStoredLanguage()].uk, flag: '🇬🇧' },
    { value: 'Portugal', label: translations[getStoredLanguage()].portugal, flag: '🇵🇹' },
];
const monthOptions = [
    { value: '1', label: translations[getStoredLanguage()].january },
    { value: '2', label: translations[getStoredLanguage()].february },
    { value: '3', label: translations[getStoredLanguage()].march },
    { value: '4', label: translations[getStoredLanguage()].april },
    { value: '5', label: translations[getStoredLanguage()].may },
    { value: '6', label: translations[getStoredLanguage()].june },
    { value: '7', label: translations[getStoredLanguage()].july },
    { value: '8', label: translations[getStoredLanguage()].august },
    { value: '9', label: translations[getStoredLanguage()].september },
    { value: '10', label: translations[getStoredLanguage()].october },
    { value: '11', label: translations[getStoredLanguage()].november },
    { value: '12', label: translations[getStoredLanguage()].december },
];
const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' }
];
let yearMulti;

function createCustomMultiselect(containerId, options, placeholder, onChange, singleSelect = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'select-box';
    box.tabIndex = 0;
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    let selected = [];
    function updateBoxText() {
        if (selected.length === 0) {
            box.innerHTML = `<span class="placeholder">${placeholder}</span>`;
        } else {
            box.innerHTML = selected.map(v => {
                const opt = options.find(o => o.value === v);
                return opt.flag ? `${opt.flag} ${opt.label}` : opt.label;
            }).join(', ');
        }
    }
    options.forEach(opt => {
        const optDiv = document.createElement('div');
        optDiv.className = 'option';
        optDiv.innerHTML = `<input type="checkbox" value="${opt.value}"> ${opt.flag ? `<span>${opt.flag}</span>` : ''} ${opt.label}`;
        optionsDiv.appendChild(optDiv);
        const cb = optDiv.querySelector('input');
        cb.type = singleSelect ? 'radio' : 'checkbox';
        cb.name = singleSelect ? containerId + '_radio' : undefined;
        // Клик по чекбоксу/радио
        cb.addEventListener('click', e => {
            e.stopPropagation();
            if (singleSelect) {
                selected = [opt.value];
                Array.from(optionsDiv.children).forEach(div => {
                    const c = div.querySelector('input');
                    c.checked = (c === cb);
                    div.classList.toggle('selected', c.checked);
                });
            } else {
                if (cb.checked) {
                    if (!selected.includes(opt.value)) selected.push(opt.value);
                } else {
                    selected = selected.filter(v => v !== opt.value);
                }
                optDiv.classList.toggle('selected', cb.checked);
            }
            updateBoxText();
            onChange(selected);
        });
        // Клик по строке
        optDiv.addEventListener('click', e => {
            if (e.target !== cb) {
                if (singleSelect) {
                    selected = [opt.value];
                    Array.from(optionsDiv.children).forEach(div => {
                        const c = div.querySelector('input');
                        c.checked = (div === optDiv);
                        div.classList.toggle('selected', c.checked);
                    });
                } else {
                    cb.checked = !cb.checked;
                    if (cb.checked) {
                        if (!selected.includes(opt.value)) selected.push(opt.value);
                    } else {
                        selected = selected.filter(v => v !== opt.value);
                    }
                    optDiv.classList.toggle('selected', cb.checked);
                }
                updateBoxText();
                onChange(selected);
            }
        });
    });
    box.addEventListener('click', e => {
        e.stopPropagation();
        container.classList.toggle('open');
    });
    document.addEventListener('click', () => {
        container.classList.remove('open');
    });
    container.appendChild(box);
    container.appendChild(optionsDiv);
    updateBoxText();
    return {
        getSelected: () => selected,
        setSelected: (vals) => {
            selected = vals;
            Array.from(optionsDiv.children).forEach(optDiv => {
                const cb = optDiv.querySelector('input');
                cb.checked = selected.includes(cb.value);
                optDiv.classList.toggle('selected', cb.checked);
            });
            updateBoxText();
        }
    };
}

let countryMulti, monthMulti;

// Обёртки для совместимости со старым кодом (и для map.js)
const countryFilter = {
    get value() {
        return (countryMulti && countryMulti.getSelected()[0]) || '';
    },
    get selectedOptions() {
        return (countryMulti ? countryMulti.getSelected().map(v => ({ value: v })) : []);
    }
};
const monthFilter = {
    get value() {
        return (monthMulti && monthMulti.getSelected()[0]) || '';
    },
    get selectedOptions() {
        return (monthMulti ? monthMulti.getSelected().map(v => ({ value: v })) : []);
    }
};
window.countryFilter = countryFilter;
window.monthFilter = monthFilter;

// Функция для получения языка из localStorage или браузера
function getStoredLanguage() {
    // Сначала проверяем localStorage
    const storedLang = localStorage.getItem('racer-language');
    if (storedLang) {
        return storedLang;
    }
    
    // Если нет в localStorage, используем язык браузера
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0];
    
    // Проверяем, поддерживается ли язык браузера
    const supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'ru'];
    if (supportedLanguages.includes(shortLang)) {
        return shortLang;
    }
    
    // По умолчанию английский
    return 'en';
}

// Функция для сохранения языка в localStorage
function saveLanguage(lang) {
    localStorage.setItem('racer-language', lang);
}

// --- ДОБАВЛЕНО: Получение выбранных значений для мультивыбора ---
function getMultiSelectValues(select) {
    if (select === countryFilter && countryMulti) return countryMulti.getSelected();
    if (select === monthFilter && monthMulti) return monthMulti.getSelected();
    if (select === yearMulti && yearMulti) return yearMulti.getSelected();
    // fallback (старый код)
    return [];
}

// --- ДОБАВЛЕНО: Получение выбранного года ---
function getSelectedYear() {
    return yearMulti && yearMulti.getSelected().length ? parseInt(yearMulti.getSelected()[0]) : currentYear;
}

// --- ДОБАВЛЕНО: Заполнение select годов ---
function fillYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    if (!yearFilter) return;
    const years = Array.from(new Set(window.eventsData.map(e => new Date(e.date).getFullYear()))).sort((a,b)=>a-b);
    yearFilter.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');
    yearFilter.value = currentYear;
}

// --- ДОБАВЛЕНО: Рендер списка событий ---
function renderEventList() {
    const eventListContainer = document.getElementById('eventListContainer');
    if (!eventListContainer) return;
    const countryVals = getMultiSelectValues(countryFilter);
    const monthVals = getMultiSelectValues(monthFilter).map(Number);
    const yearVal = getSelectedYear();
    const currentLang = document.querySelector('.flag-btn.active').getAttribute('data-lang');
    let events = window.eventsData;
    console.log('[EVENTS] Всего событий:', events.length);
    console.log('[EVENTS] Страны:', countryVals, 'Месяцы:', monthVals, 'Год:', yearVal);
    let filtered = events;
    if (countryVals.length) {
        filtered = filtered.filter(e => countryVals.includes(e.country));
        console.log('[EVENTS] После фильтрации по странам:', filtered.length);
    }
    if (monthVals.length) {
        filtered = filtered.filter(e => {
            const d = new Date(e.date || e.day);
            return monthVals.includes(d.getMonth() + 1);
        });
        console.log('[EVENTS] После фильтрации по месяцам:', filtered.length);
    }
    if (yearVal) {
        filtered = filtered.filter(e => {
            const d = new Date(e.date || e.day);
            return d.getFullYear() === yearVal;
        });
        console.log('[EVENTS] После фильтрации по году:', filtered.length);
    }
    filtered.sort((a,b)=>{
        const da = new Date(a.date || a.day);
        const db = new Date(b.date || b.day);
        return da-db;
    });
    if (filtered.length === 0) {
        console.log('[EVENTS] Нет событий после фильтрации!');
    }
    let html = `<table class="event-list-table"><thead><tr><th>${translations[currentLang]?.date||'Date'}</th><th>${translations[currentLang]?.eventType||'Type'}</th><th>${translations[currentLang]?.track||'Track'}</th><th>${translations[currentLang]?.country||'Country'}</th><th>${translations[currentLang]?.officialWebsite||'Site'}</th></tr></thead><tbody>`;
    for (const e of filtered) {
        const d = new Date(e.date || e.day);
        html += `<tr><td>${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}.${d.getFullYear()}</td><td>${e.event ? e.event.split(' - ')[0] : ''}</td><td>${e.track}</td><td>${e.flag}</td><td><a href="${e.organizer_url}" target="_blank">${e.organizer_url||'Site'}</a></td></tr>`;    }
    html += '</tbody></table>';
    eventListContainer.innerHTML = html;
}

// --- ДОБАВЛЕНО: Синхронизация фильтров и вкладок с URL ---
function updateURLFromState() {
    const params = new URLSearchParams();
    // Страны
    const c = getMultiSelectValues(countryFilter);
    if (c.length) params.set('country', c.join(','));
    // Месяцы
    const m = getMultiSelectValues(monthFilter);
    if (m.length) params.set('month', m.join(','));
    // Год
    const y = getSelectedYear();
    if (y) params.set('year', y);
    // Вкладка
    const activeView = document.querySelector('.view-toggle button.active').getAttribute('data-view');
    if (activeView) params.set('view', activeView);
    history.replaceState(null, '', '?' + params.toString());
}

function applyStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    // Страны
    if (params.has('country') && countryMulti) {
        const vals = params.get('country').split(',');
        countryMulti.setSelected(vals);
    }
    // Месяцы
    if (params.has('month') && monthMulti) {
        const vals = params.get('month').split(',');
        monthMulti.setSelected(vals);
    }
    // Год
    if (params.has('year') && yearMulti) {
        yearMulti.setSelected([params.get('year')]);
        currentYear = parseInt(params.get('year'));
    }
    // Вкладка
    if (params.has('view')) {
        const view = params.get('view');
        // Явно активируем нужную вкладку
        const viewButtons = document.querySelectorAll('.view-toggle button');
        const views = document.querySelectorAll('.view');
        viewButtons.forEach(btn => btn.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        const btn = document.querySelector(`.view-toggle button[data-view="${view}"]`);
        const viewDiv = document.getElementById(view + 'View');
        if (btn && viewDiv) {
            btn.classList.add('active');
            viewDiv.classList.add('active');
            if (view === 'list') {
                renderEventList();
            } else if (view === 'calendar') {
                renderCalendar();
            } else if (view === 'map') {
                setTimeout(() => {
                    if (window.map) {
                        map.invalidateSize();
                        updateMapMarkers();
                    }
                }, 100);
            }
        }
    }
}

async function loadTracks() {
  if (!window.tracks) {
    const resp = await fetch('track.json');
    window.tracks = await resp.json();
  }
}

async function loadEvents() {
  if (!window.eventsData) {
    const resp = await fetch('events.json');
    window.eventsData = await resp.json();
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async function() {
    await loadTracks();
    await loadEvents();
    fillYearFilter();
    countryMulti = createCustomMultiselect(
        'countryMultiSelect',
        countryOptions,
        translations[getStoredLanguage()].allCountries,
        () => {
            renderCalendar();
            renderEventList();
            updateMapMarkers();
            updateURLFromState();
        }
    );
    monthMulti = createCustomMultiselect(
        'monthMultiSelect',
        monthOptions,
        translations[getStoredLanguage()].allMonths,
        () => {
            renderCalendar();
            renderEventList();
            updateMapMarkers();
            updateURLFromState();
        }
    );
    yearMulti = createCustomMultiselect(
        'yearMultiSelect',
        yearOptions,
        '2025',
        (selected) => {
            if (selected.length) {
                currentYear = parseInt(selected[0]);
                renderCalendar();
                renderEventList();
                updateMapMarkers();
                updateURLFromState();
            }
        },
        true // одиночный выбор
    );
    applyStateFromURL();
    setupLanguageFlags(getStoredLanguage());
    translateInterface(getStoredLanguage());
    renderCalendar();
    renderEventList();
    setupEventListeners();
    setupViewToggle();
    initializeMap();
});

// Настройка флагов языков
function setupLanguageFlags(initialLang = 'en') {
    const flagButtons = document.querySelectorAll('.flag-btn');
    
    // Устанавливаем активный флаг
    flagButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === initialLang) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Убираем активный класс со всех флагов
            flagButtons.forEach(flag => flag.classList.remove('active'));
            
            // Добавляем активный класс к выбранному флагу
            this.classList.add('active');
            
            // Сохраняем выбор в localStorage
            saveLanguage(selectedLang);
            
            // Переводим интерфейс
            translateInterface(selectedLang);
            
            // Перерисовываем календарь с новым языком
            renderCalendar();
            
            // Обновляем карту
            if (map) {
                updateMapMarkers();
            }
        });
    });
}

// --- ДОБАВЛЕНО: Обновление рендера при изменении фильтров ---
function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
        updateURLFromState();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
        updateURLFromState();
    });

    // countryFilter.addEventListener('change', () => { // This line is removed as countryFilter is now an object
    //     renderCalendar();
    //     renderEventList();
    //     updateMapMarkers();
    //     updateURLFromState();
    // });
    
    // monthFilter.addEventListener('change', () => { // This line is removed as monthFilter is now an object
    //     renderCalendar();
    //     renderEventList();
    //     updateMapMarkers();
    //     updateURLFromState();
    // });

    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.addEventListener('change', () => {
            currentYear = parseInt(yearFilter.value);
            renderCalendar();
            renderEventList();
            updateMapMarkers();
            updateURLFromState();
        });
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Настройка переключения видов
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle button');
    const views = document.querySelectorAll('.view');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.getAttribute('data-view');
            
            // Убираем активный класс со всех кнопок и видов
            viewButtons.forEach(btn => btn.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке и виду
            button.classList.add('active');
            document.getElementById(targetView + 'View').classList.add('active');
            
            // Если переключаемся на карту, обновляем её размер
            if (targetView === 'map' && map) {
                setTimeout(() => {
                    map.invalidateSize();
                    updateMapMarkers();
                }, 100);
            }
            if (targetView === 'list') {
                renderEventList();
            }
            updateURLFromState();
        });
    });
}

// Рендеринг календаря
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);
    
    const currentLang = document.querySelector('.flag-btn.active').getAttribute('data-lang');
    const monthNames = {
        ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    };
    
    currentMonthElement.textContent = `${monthNames[currentLang] ? monthNames[currentLang][currentMonth] : monthNames.en[currentMonth]} ${currentYear}`;
    
    calendarDays.innerHTML = '';
    
    const selectedCountry = countryFilter.value;
    const selectedMonth = monthFilter.value;
    
    // Фильтрация событий
    let filteredEvents = window.eventsData;
    if (selectedCountry) {
        filteredEvents = filteredEvents.filter(event => event.country === selectedCountry);
    }
    if (selectedMonth) {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.day);
            return eventDate.getMonth() + 1 === parseInt(selectedMonth);
        });
    }
    
    // Создание дней календаря
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Проверяем, принадлежит ли день текущему месяцу
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Проверяем, является ли день сегодняшним
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        // Поиск событий для этого дня
        const dayEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.day);
            return eventDate.toDateString() === date.toDateString();
        });
        
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-events';
            
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';
                eventElement.innerHTML = `
                    <span class="event-flag">${event.flag}</span>
                    <span>${event.event.split(' - ')[1] || event.event}</span>
                `;
                eventElement.addEventListener('click', () => showEventDetails(event));
                eventsContainer.appendChild(eventElement);
            });
            
            dayElement.appendChild(eventsContainer);
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Показ деталей события
function showEventDetails(event) {
    const currentLang = document.querySelector('.flag-btn.active').getAttribute('data-lang');
    const monthNames = {
        ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    };
    
    const eventDate = new Date(event.day);
    const monthName = monthNames[currentLang] ? monthNames[currentLang][eventDate.getMonth()] : monthNames.en[eventDate.getMonth()];
    
    eventDetails.innerHTML = `
        <div class="event-detail">
            <h3>${event.event}</h3>
            <div class="event-info">
                <div class="event-info-item">
                    <strong>${translations[currentLang]?.track || translations.en.track}:</strong>
                    ${event.track}
                </div>
                <div class="event-info-item">
                    <strong>${translations[currentLang]?.country || translations.en.country}:</strong>
                    ${event.flag} ${event.country}
                </div>
                <div class="event-info-item">
                    <strong>${translations[currentLang]?.date || translations.en.date}:</strong>
                    ${eventDate.getDate()} ${monthName} ${eventDate.getFullYear()}
                </div>
                <div class="event-info-item">
                    <strong>${translations[currentLang]?.eventType || translations.en.eventType}:</strong>
                    ${event.event.split(' - ')[0]}
                </div>
            </div>
            <div class="event-links">
                <a href="${event.organizer_url}" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    ${translations[currentLang]?.officialWebsite || translations.en.officialWebsite}
                </a>
                <a href="#" onclick="searchEvent('${event.event}')">
                    <i class="fas fa-search"></i>
                    ${translations[currentLang]?.searchInfo || translations.en.searchInfo}
                </a>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Функция поиска события
function searchEvent(eventName) {
    const searchQuery = encodeURIComponent(eventName + ' 2025');
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
}

// Экспорт данных в JSON (для демонстрации)
function exportEventsToJSON() {
    const jsonData = JSON.stringify(window.eventsData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'racing_events_2025.json';
    a.click();
    URL.revokeObjectURL(url);
}
