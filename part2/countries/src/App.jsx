import { useState, useEffect } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY


const Results = ({ countries }) => {
  if (countries) {
    if (countries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    } else if (countries.length > 1) {
      const [selectedCountry, setSelectedCountry] = useState(null)
      const countryNames = countries.map(item => item.name.common).sort()
      const sortedCountries = countries.sort((a, b) => a.name.common.localeCompare(b.name.common))
      //console.log("This is countryNames: ", countryNames)
      //console.log("This is countries: ", sortedCountries)
      // note: some countries appear in search because of alternate spellings of the name
      return (
        <div>
          {countryNames.map((name, index) => 
          <p key={index}>
            {name} <button onClick={() => setSelectedCountry(sortedCountries[index])}>show</button></p>)}
          {selectedCountry ? <CountryData country={selectedCountry} /> : null}
        </div>
      )
    } else if (countries.length === 1) {
      return <CountryData country={countries[0]} />
    } else {
      return <p>No matches found</p>
    }
  }
}

const CountryData = ({ country }) => {
  const languages = Object.values(country.languages)
  console.log(languages)
  return (
    <div>
      <h1><b>{country.name.common}</b></h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h4><b>languages:</b></h4>
      {languages.map((language, index) => <li key={index} style={{marginLeft: '20px'}}>{language}</li>)}
      <img style={{marginTop: '20px'}} src={country.flags.png} width='150px' />
      <h2><b>Weather in {country.name.common}</b></h2>
      <WeatherInfo country={country} />
    </div>
  )
}

const WeatherInfo = ({ country }) => {
  const [response, setResponse] = useState(null)
  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}`)
      .then(response => {
        //console.log("weather response: ", response.data)
        setResponse(response.data)
      })
  }, [country])

  if (!response) {
    return null
  } else {
    const realTemp = Math.round((response.main.temp - 273.15) * 9/5 + 32)
    return (
      <div>
        <p>temperature: {realTemp} °F </p>
        <img src={`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`} />
        <p>wind: {response.wind.speed} m/s</p>
      </div>
    )
  }
}

const HeaderMessage = ({ message }) => {
  if (message) {
    return (
      <div className={message.type}> 
        {message.content}
      </div>
    )
  }
  return null
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState(null)
  const [message, setMessage] = useState(null)

  const onSearch = (search) => {
    axios.get(`https://restcountries.com/v3.1/name/${search}`)
      .then(response => {
        setCountries(response.data)
      }).catch(error => {
        setCountries(null)
        setMessage({ content: `No countries found. Retry search`, type: 'error' })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const onSearchChange = (event) => {
    setSearch(event.target.value)
    onSearch(event.target.value)
  }
  console.log('countries', countries)
  return (
    <div>
      <HeaderMessage message={message} />
      <form>
        find countries: <input value={search} onChange={onSearchChange} />
      </form>
      <Results countries={countries} />
    </div>
  )
}

export default App