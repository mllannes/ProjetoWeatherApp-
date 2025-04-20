const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const translationMap = { 
  'Clear Sky': 'Céu Limpo',
  'Few Clouds': 'Poucas Nuvens',
  'Scattered Clouds': 'Parcialmente Nublado',
  'Broken Clouds': 'Predominante Nublado',
  'Shower Rain': 'Chuva Rápida', 
  'Rain': 'Chuva',
  'Thunderstorm': 'Tempestade',
  'Snow': 'Neve',
  'Mist': 'Neblina',
  'Haze': 'Nevoeiro',
  'Fog': 'Névoa', 
  'Dust': 'Poeira',
  'Sand': 'Areia'
};

search.addEventListener('click', () => {

  const APIKey = 'dca55fe5496528b707551edb7d84d539';
  const city = document.querySelector('.search-box input').value;

  if (city === '') return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {

      if(json.cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        return;      
      }

      error404.style.display = 'none';
      error404.classList.remove('fadeIn');

      const image = document.querySelector('.weather-box img');
      const temperature = document.querySelector('.weather-box .temperature');
      const description = document.querySelector('.weather-box .description');
      const humidity = document.querySelector('.weather-details .humidity span');
      const wind = document.querySelector('.weather-details .wind span');

      // Atualizando a imagem de acordo com o tipo de tempo
      switch (json.weather[0].main) {
        case 'Clear':
          image.src = 'images/clear.png';
          break;
        case 'Rain':
          image.src = 'images/rain.png';
          break;
        case 'Snow':
          image.src = 'images/snow.png';
          break;
        case 'Clouds':
          image.src = 'images/cloud.png';
          break;
        case 'Haze':
          image.src = 'images/mist.png';
          break;
        default:
          image.src = '';
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      const originalDescription = json.weather[0].description;

      // Usando o serviço de tradução
      fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://libretranslate.de/translate"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          q: originalDescription,
          source: "en",
          target: "pt",
          format: "text"
        })
      })
      .then(res => res.json())
      .then(data => {
        const translatedDescription = data.contents.translated; // Obtendo a tradução
        description.innerHTML = translatedDescription; // Exibindo a tradução
      })
      .catch(() => { 
        description.innerHTML = originalDescription; // Se falhar, mostra o texto original
      });

      weatherBox.style.display = '';
      weatherDetails.style.display = '';
      weatherBox.classList.add('fadeIn');
      container.style.height = '590px';

    })
    .catch(error => {
      console.error("Erro ao carregar os dados:", error);
      description.innerHTML = 'Erro ao buscar dados';
    });

});
