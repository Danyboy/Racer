// Инициализация карты
async function loadTracks() {
  if (!window.tracks) {
    const resp = await fetch('track.json');
    window.tracks = await resp.json();
  }
}

async function initializeMap() {
  await loadTracks();
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

  window.tracks.tracks.forEach(track => {
    if (track.coordinates) {
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
function createRedMarker(track) {
  // Создаем кастомную иконку для маркера

  const redIcon = L.divIcon({
    className: 'custom-marker',
    html: `
          <div class="marker-container">
              <div class="marker-title">${track.name || track.track || ''}</div>
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
function createPopupContent(track) {
  const currentLang = document.querySelector('.flag-btn.active').getAttribute('data-lang');
  const monthNames = {
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
  };

  const eventDate = new Date(track.date);
  const monthName = monthNames[currentLang] ? monthNames[currentLang][eventDate.getMonth()] : monthNames.en[eventDate.getMonth()];

//           <p><strong>${translations[currentLang]?.eventType || translations.en.eventType}:</strong> ${event.event}</p>
//            <p><strong>${translations[currentLang]?.date || translations.en.date}:</strong> ${eventDate.getDate()} ${monthName} ${eventDate.getFullYear()}</p>


  return `
      <div class="popup-content">
          <h3>${track.flag || ''} ${track.name || track.track || ''}</h3>
          <p><strong>${translations[currentLang]?.country || translations.en.country}:</strong> ${track.country || ''}</p>
          <a href="${track.official_website || track.website || ''}" target="_blank">${translations[currentLang]?.officialWebsite || translations.en.officialWebsite}</a>
      </div>
  `;
}

// Обновление маркеров на карте при фильтрации
function updateMapMarkers() {
  if (!window.countryFilter || !window.monthFilter) return;
  const selectedCountries = window.countryFilter.selectedOptions.map(opt => opt.value);
  const allTracks = (window.tracks && window.tracks.tracks) ? window.tracks.tracks : [];
  console.log('[MAP] Всего треков:', allTracks.length);
  console.log('[MAP] Выбранные страны:', selectedCountries);

  // Очищаем существующие маркеры
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Фильтруем треки
  let filteredTracks = allTracks;
  if (selectedCountries.length) {
    filteredTracks = filteredTracks.filter(track => {
      const country = (track.country || '').toLowerCase();
      const code = (track.country_code || '').toLowerCase();
      return selectedCountries.includes(country) || selectedCountries.includes(code);
    });
  }
  console.log('[MAP] Треков после фильтрации:', filteredTracks.length);

  // Добавляем маркеры для отфильтрованных треков
  filteredTracks.forEach(track => {
    if (track.coordinates) {
      let coords;
      if (Array.isArray(track.coordinates)) {
        coords = track.coordinates;
      } else if (track.coordinates.lat !== undefined && track.coordinates.lng !== undefined) {
        coords = [track.coordinates.lat, track.coordinates.lng];
      } else {
        console.log('[MAP] Нет координат для трека:', track);
        return;
      }
      console.log('[MAP] Маркер:', track.name || track.track, coords);
      const customIcon = createRedMarker(track);
      const marker = L.marker(coords, { icon: customIcon })
        .bindPopup(createPopupContent(track))
        .addTo(map);
      markers.push(marker);
    } else {
      console.log('[MAP] Нет координат для трека:', track);
    }
  });

  // Если есть маркеры, центрируем карту на них
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
    console.log('[MAP] Центрирую карту на маркерах');
  } else {
    console.log('[MAP] Нет маркеров для отображения');
  }
}