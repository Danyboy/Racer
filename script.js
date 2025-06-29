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
const countryFilter = document.getElementById('countryFilter');
const monthFilter = document.getElementById('monthFilter');
const modal = document.getElementById('eventModal');
const eventDetails = document.getElementById('eventDetails');
const closeModal = document.querySelector('.close');

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

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const initialLang = getStoredLanguage();
    setupLanguageFlags(initialLang);
    translateInterface(initialLang);
    renderCalendar();
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

// Настройка обработчиков событий
function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    countryFilter.addEventListener('change', () => {
        renderCalendar();
        updateMapMarkers();
    });
    
    monthFilter.addEventListener('change', () => {
        renderCalendar();
        updateMapMarkers();
    });

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
    let filteredEvents = eventsData;
    if (selectedCountry) {
        filteredEvents = filteredEvents.filter(event => event.country === selectedCountry);
    }
    if (selectedMonth) {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
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
            const eventDate = new Date(event.date);
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
                    <span class="event-track-img">${event.trackImage}</span>
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
    
    const eventDate = new Date(event.date);
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
                    ${event.flag} ${event.countryName}
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
            <div class="event-description">
                <strong>${translations[currentLang]?.description || translations.en.description}:</strong><br>
                ${event.description}
            </div>
            <div class="event-links">
                <a href="${event.website}" target="_blank">
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
    const searchQuery = encodeURIComponent(eventName + ' 2024');
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
}

// Экспорт данных в JSON (для демонстрации)
function exportEventsToJSON() {
    const jsonData = JSON.stringify(eventsData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'racing_events_2024.json';
    a.click();
    URL.revokeObjectURL(url);
}
