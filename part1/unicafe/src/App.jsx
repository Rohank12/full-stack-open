import { useState } from 'react'

const Header = ({ description }) => <h1>{description}</h1>

const Display = ({ value }) => <div>{value}</div>

const Button = (props) => {
  console.log(props)
  return (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  )
}

const StatisticLine = ({ text, value }) => {
  //console.log(text)
  if (text === 'positive') {
    return (
      <td>{text + ' ' + value + '%'}</td>
    )
  }
  return (
    <td>{text + ' ' + value}</td>
  )
}

const Statistics = (props) => {
  if (props.good == 0 && props.neutral == 0 && props.bad == 0) {
    return (
      <div>
        <Display value={'No feedback given'} />
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <tr><StatisticLine text='good' value={props.good} /></tr>
        <tr><StatisticLine text='neutral' value={props.neutral} /></tr>
        <tr><StatisticLine text='bad' value={props.bad} /></tr>
        <tr><StatisticLine text='all' value={props.good + props.neutral + props.bad} /></tr>
        <tr><StatisticLine text='average' value={(props.good - props.bad) / (props.good + props.neutral + props.bad)} /></tr>
        <tr><StatisticLine text='positive' value={(props.good / (props.good + props.neutral + props.bad)) * 100} /></tr>
      </tbody>
    </table>
  )

}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  /*console.log("Good: ", good)
  console.log("Bad: ", bad)
  console.log("Neutral: ", neutral)*/

  return (
    <div>
      <Header description={'give feedback'} />
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Header description={'statistics'} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App