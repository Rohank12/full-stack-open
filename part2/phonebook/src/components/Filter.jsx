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
  
  export default Filter