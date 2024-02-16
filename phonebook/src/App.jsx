import { useState } from 'react'

const Filter = ({ filter, setFilter }) => {

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      filter shown with <input id='name' value={filter} onChange={handleFilter}/>
    </div>
  )
}

const PersonForm = (prop) => {

  const handleNameChange = (event) => {
    prop.setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    prop.setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: prop.newName,
      number: prop.newNumber
    }
    const nameToAdd = prop.persons.findIndex(person => person.name === prop.newName)

    if (nameToAdd !== -1) {
      alert(`${prop.newName} is already added to phonebook`)
    } else {
      prop.setPersons(prop.persons.concat(personObject))
      prop.setNewName('')
      prop.setNewNumber('')
    }
  }

  return (
    <form onSubmit={addName}>
        <div>name: <input value={prop.newName} onChange={handleNameChange}/></div>
        <div>number: <input value={prop.newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

const Persons = ({ persons, filter }) => {
  const showNames = filter
  ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  : persons
  return (
    <ul>
      {showNames.map((person, i) =>
        <li key={i}>{person.name} {person.number}</li>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  return (
    <div>
      debug: {filter}
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App