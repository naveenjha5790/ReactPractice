export default function Entry(props){
    return (
        <div className="clubs">
            <img id="img" src={props.link} alt="Home Ground" />
            <p><b>Club Name:</b>{props.club}<br />
            <b>Plays at:</b>{props.Hg}<br />
            <b>Managed by:</b>{props.manager}<br />
            <b>Preview:</b>{props.preview}<br />
            <b>Expectation:</b>{props.expectations}<br />
           <b>Prediction:</b> {props.predictions}<br />
            <b>MVP:</b>{props.MVP}
            </p>
        </div>
    )
}
