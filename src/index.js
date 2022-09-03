import './css/styles.css';
import API from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
// console.log(refs.countryList);

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
// console.log(input);
function onSearch(evt) {
  const searchQuery = evt.target.value.trim();
  //   console.log(searchQuery);
  if (searchQuery.length !== 0) {
    API.fetchCountries(searchQuery).then(renderCard).catch(onFetchError);
  } else {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }
}

function renderCard(countries) {
  console.log(countries.length);
  if (countries.length > 10) {
    Notiflix.Notify.failure(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1 && countries.length < 10) {
    refs.countryList.innerHTML = countries
      .map(({ name, flags }) => {
        return `<li>
        <div class="container">
          <img src="${flags.svg}" alt="flag" width=40px height=35px class="img-country"><p>${name.official}</p>
          </div>
        </li>`;
      })
      .join('');
    refs.countryInfo.innerHTML = '';
  } else {
    refs.countryInfo.innerHTML = countries
      .map(({ name, capital, population, flags, languages }) => {
        return `
          <h3 class="container"><img src="${
            flags.svg
          }" alt="flag" width=40px class="img-country"><p>${
          name.official
        }</p></h3>
          <p><b>Capital:</b> ${capital}</p>
          <p><b>Population:</b> ${population}</p>
          <p><b>Languages:</b> ${Object.values(languages)}</p>`;
      })
      .join('');
    refs.countryList.innerHTML = '';
  }
}
function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
