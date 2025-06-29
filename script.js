// Данные о гоночных событиях
const eventsData = [
    {
        id: 1,
        date: "2024-05-05",
        track: "Circuit de Barcelona-Catalunya",
        country: "spain",
        countryName: "Испания",
        event: "Formula 1 - Гран-при Испании",
        description: "Главное событие сезона Формулы-1 в Испании. Трек известен своими высокоскоростными поворотами и является одним из самых технически сложных в календаре.",
        website: "https://www.circuitcat.com/en/",
        flag: "🇪🇸",
        trackImage: "🏁"
    },
    {
        id: 2,
        date: "2024-05-12",
        track: "Circuit Paul Ricard",
        country: "france",
        countryName: "Франция",
        event: "GT World Challenge Europe",
        description: "Гоночная серия GT с участием лучших GT автомобилей Европы. Трек известен своими уникальными полосами безопасности.",
        website: "https://www.circuitpaulricard.com/",
        flag: "🇫🇷",
        trackImage: "🏁"
    },
    {
        id: 3,
        date: "2024-05-19",
        track: "Nürburgring Nordschleife",
        country: "germany",
        countryName: "Германия",
        event: "24 часа Нюрбургринга",
        description: "Легендарная 24-часовая гонка на самой сложной трассе в мире. Северная петля Нюрбургринга - мечта каждого гонщика.",
        website: "https://www.nuerburgring.de/",
        flag: "🇩🇪",
        trackImage: "🏁"
    },
    {
        id: 4,
        date: "2024-05-26",
        track: "Red Bull Ring",
        country: "austria",
        countryName: "Австрия",
        event: "MotoGP - Гран-при Австрии",
        description: "Гоночная серия MotoGP на живописном австрийском треке в Альпах. Высокоскоростная трасса с захватывающими видами.",
        website: "https://www.redbullring.com/",
        flag: "🇦🇹",
        trackImage: "🏁"
    },
    {
        id: 5,
        date: "2024-06-02",
        track: "Automotodrom Brno",
        country: "czech",
        countryName: "Чехия",
        event: "MotoGP - Гран-при Чехии",
        description: "Исторический трек в Брно, один из самых любимых среди гонщиков MotoGP за свою техническую сложность.",
        website: "https://www.automotodrombrno.cz/",
        flag: "🇨🇿",
        trackImage: "🏁"
    },
    {
        id: 6,
        date: "2024-06-09",
        track: "Circuit Zandvoort",
        country: "netherlands",
        countryName: "Нидерланды",
        event: "Formula 1 - Гран-при Нидерландов",
        description: "Возвращение Формулы-1 в Зандворт после долгого перерыва. Трек известен своими бандингами и атмосферой.",
        website: "https://www.circuit-zandvoort.nl/",
        flag: "🇳🇱",
        trackImage: "🏁"
    },
    {
        id: 7,
        date: "2024-06-16",
        track: "Silverstone Circuit",
        country: "uk",
        countryName: "Великобритания",
        event: "Formula 1 - Гран-при Великобритании",
        description: "Исторический трек, где состоялась первая гонка Формулы-1 в 1950 году. Дом британского автоспорта.",
        website: "https://www.silverstone.co.uk/",
        flag: "🇬🇧",
        trackImage: "🏁"
    },
    {
        id: 8,
        date: "2024-06-23",
        track: "Autódromo Internacional do Algarve",
        country: "portugal",
        countryName: "Португалия",
        event: "MotoGP - Гран-при Португалии",
        description: "Современный трек в Портимао с захватывающими перепадами высот и технически сложными поворотами.",
        website: "https://www.autodromodoalgarve.com/",
        flag: "🇵🇹",
        trackImage: "🏁"
    },
    {
        id: 9,
        date: "2024-06-30",
        track: "Circuit de la Sarthe",
        country: "france",
        countryName: "Франция",
        event: "24 часа Ле-Мана",
        description: "Самая престижная гонка на выносливость в мире. Легендарная трасса, где скорость и надежность решают все.",
        website: "https://www.24h-lemans.com/",
        flag: "🇫🇷",
        trackImage: "🏁"
    },
    {
        id: 10,
        date: "2024-07-07",
        track: "Hockenheimring",
        country: "germany",
        countryName: "Германия",
        event: "DTM - Немецкий чемпионат",
        description: "Популярная немецкая гоночная серия на историческом треке Хоккенхайм. Высокие скорости и захватывающие гонки.",
        website: "https://www.hockenheimring.de/",
        flag: "🇩🇪",
        trackImage: "🏁"
    },
    {
        id: 11,
        date: "2024-07-14",
        track: "TT Circuit Assen",
        country: "netherlands",
        countryName: "Нидерланды",
        event: "MotoGP - Голландский TT",
        description: "Историческая гонка, известная как 'Собор скорости'. Один из самых быстрых треков в календаре MotoGP.",
        website: "https://www.ttcircuit.com/",
        flag: "🇳🇱",
        trackImage: "🏁"
    },
    {
        id: 12,
        date: "2024-07-21",
        track: "Brands Hatch",
        country: "uk",
        countryName: "Великобритания",
        event: "BTCC - Британский чемпионат",
        description: "Популярная серия кузовных гонок на технически сложном треке с множеством подъемов и спусков.",
        website: "https://www.brandshatch.co.uk/",
        flag: "🇬🇧",
        trackImage: "🏁"
    },
    {
        id: 13,
        date: "2024-07-28",
        track: "Circuito de Jerez",
        country: "spain",
        countryName: "Испания",
        event: "MotoGP - Гран-при Испании",
        description: "Классический трек в Хересе, где часто проводятся тесты и финальные гонки сезона MotoGP.",
        website: "https://www.circuitodejerez.com/",
        flag: "🇪🇸",
        trackImage: "🏁"
    },
    {
        id: 14,
        date: "2024-08-04",
        track: "Sachsenring",
        country: "germany",
        countryName: "Германия",
        event: "MotoGP - Гран-при Германии",
        description: "Технически сложный трек с множеством левых поворотов. Любимый трек многих гонщиков MotoGP.",
        website: "https://www.sachsenring.de/",
        flag: "🇩🇪",
        trackImage: "🏁"
    },
    {
        id: 15,
        date: "2024-08-11",
        track: "Salzburgring",
        country: "austria",
        countryName: "Австрия",
        event: "GT Masters Austria",
        description: "Высокоскоростной трек в живописных австрийских Альпах. Популярен среди GT серий.",
        website: "https://www.salzburgring.at/",
        flag: "🇦🇹",
        trackImage: "🏁"
    }
];

// Текущая дата
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

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

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    setupEventListeners();
    setupViewToggle();
});

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

    countryFilter.addEventListener('change', renderCalendar);
    monthFilter.addEventListener('change', renderCalendar);

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
        });
    });
}

// Рендеринг календаря
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);
    
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
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
    eventDetails.innerHTML = `
        <div class="event-detail">
            <h3>${event.event}</h3>
            <div class="event-info">
                <div class="event-info-item">
                    <strong>Трек:</strong>
                    ${event.track}
                </div>
                <div class="event-info-item">
                    <strong>Страна:</strong>
                    ${event.flag} ${event.countryName}
                </div>
                <div class="event-info-item">
                    <strong>Дата:</strong>
                    ${new Date(event.date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                <div class="event-info-item">
                    <strong>Тип события:</strong>
                    ${event.event.split(' - ')[0]}
                </div>
            </div>
            <div class="event-description">
                <strong>Описание:</strong><br>
                ${event.description}
            </div>
            <div class="event-links">
                <a href="${event.website}" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    Официальный сайт трека
                </a>
                <a href="#" onclick="searchEvent('${event.event}')">
                    <i class="fas fa-search"></i>
                    Поиск информации
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

// Добавляем кнопку экспорта в консоль для демонстрации
console.log('Для экспорта данных в JSON выполните: exportEventsToJSON()'); 