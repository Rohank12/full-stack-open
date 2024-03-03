const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => {
  return <p>{part.name} {part.exercises}</p>
}

const sumExercises = (parts) => {
  const total = parts.reduce((s, p) => {
    return s + p.exercises}, 0)
  return total
}

const Content = ({ parts }) => {
  return parts.map(part => 
    <Part key={part.id} part={part}/>
  )
}

const Course = ({ courses }) => {
  console.log(courses)
  return courses.map(course =>
    <div key={course.id}>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={sumExercises(course.parts)} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Course courses={courses} />
}

export default App