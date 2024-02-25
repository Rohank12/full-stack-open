import personService from '../services/persons'

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
        const confirm = window.confirm(`${prop.newName} is already added to phonebook, replace the old number with a new one?`)
        if (confirm) {
          const updatePerson = prop.persons.find(person => person.name === prop.newName)
          personService.update(updatePerson.id, personObject).then(returnedPerson => {
            prop.setPersons(prop.persons.map(person => person.id !== updatePerson.id ? person : returnedPerson))
            prop.setNewName('')
            prop.setNewNumber('')
          
          })
        }
      } else {
        personService.add(personObject).then(returnedPerson => {
          prop.setPersons(prop.persons.concat(returnedPerson))
          prop.setNewName('')
          prop.setNewNumber('')
        })
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

  export default PersonForm