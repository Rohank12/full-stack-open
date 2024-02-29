const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    console.log('message:', message.content)
    console.log('type:', message.type)
    return (
        <div className={message.type}>
        {message.content}
        </div>
    )
}

export default Notification