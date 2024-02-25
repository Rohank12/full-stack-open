import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    personService.get().then(initialPersons => {
      setPersons(initialPersons)
    })
  }
  useEffect(hook, [])

  const deleteAction = (personToDelete) => {
    const confirm = window.confirm(`Delete ${personToDelete.name}?`)
    if (confirm) {
      personService.deletePerson(personToDelete.id).then(() => {
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteAction={deleteAction} />
    </div>
  )
}

export default App