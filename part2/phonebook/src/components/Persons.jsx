const Persons = ({ persons, filter, deleteAction }) => {
    const showNames = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons
    return (
      <ul>
        {showNames.map((person, i) =>
          <li key={i}>{person.name} {person.number}
          <button onClick={() => deleteAction(person)}>delete</button>
          </li>)}
      </ul>
    )
  }

  export default Persons