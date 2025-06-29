// Инициализация карты
function initializeMap() {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([50.0, 10.0], 3);

  // Добавляем темную карту
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  // Добавляем маркеры для всех треков
  addTrackMarkers();
}

// Добавление маркеров треков на карту
function addTrackMarkers() {
  // Очищаем существующие маркеры
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  tracks.tracks.forEach(track => {
    if (track.coordinates) {
      console.log(track.id)
      const customIcon = createRedMarker(track);
      // const marker = L.marker([track.coordinates.lat, track.coordinates.lng], { icon: customIcon })
      const marker = L.marker([track.coordinates.lat, track.coordinates.lng])
        .bindPopup(createPopupContent(track))
        .addTo(map);

      markers.push(marker);
    }
  });
}

// Добавление маркеров треков на карту
function addTrackMarkersOld() {
  // Очищаем существующие маркеры
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  eventsData.forEach(event => {
    if (event.coordinates) {
      // const customIcon = createRedMarker(event);
      const marker = L.marker(event.coordinates, { icon: customIcon })
        .bindPopup(createPopupContent(event))
        .addTo(map);

      markers.push(marker);
    }
  });
}

// Создание красного маркера с названием трека
function createRedMarker(event) {
  // Создаем кастомную иконку для маркера

  const redIcon = L.divIcon({
    className: 'custom-marker',
    html: `
          <div class="marker-container">
              <div class="marker-title">${event.id}</div>
              <div class="marker-pin">🏁</div>
          </div>
      `,
    iconSize: [120, 40],
    iconAnchor: [60, 40],
    popupAnchor: [0, -40]
  });

  return redIcon;
}


// Создание содержимого попапа для маркера
function createPopupContent(event) {
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

//           <p><strong>${translations[currentLang]?.eventType || translations.en.eventType}:</strong> ${event.event}</p>
//            <p><strong>${translations[currentLang]?.date || translations.en.date}:</strong> ${eventDate.getDate()} ${monthName} ${eventDate.getFullYear()}</p>


  return `
      <div class="popup-content">
          <h3>${event.flag} ${event.id}</h3>
          <p><strong>${translations[currentLang]?.country || translations.en.country}:</strong> ${event.country}</p>
          <a href="${event.website}" target="_blank">${translations[currentLang]?.official_website || translations.en.officialWebsite}</a>
      </div>
  `;
}

// Обновление маркеров на карте при фильтрации
function updateMapMarkers() {
  return

  const selectedCountry = countryFilter.value;
  const selectedMonth = monthFilter.value;

  // Очищаем существующие маркеры
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Фильтруем события
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

  // Добавляем маркеры для отфильтрованных событий
  filteredEvents.forEach(event => {
    if (event.coordinates) {
      const customIcon = createRedMarker(event);
      const marker = L.marker(event.coordinates, { icon: customIcon })
        .bindPopup(createPopupContent(event))
        .addTo(map);

      markers.push(marker);
    }
  });

  // Если есть маркеры, центрируем карту на них
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}