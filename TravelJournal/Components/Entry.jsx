export default function Entry (props){
    return (
        <article className="JournalEntry">
            <div className="main">
                <img className="Japan" src={props.image.src} alt={props.image.alt} />
            </div>
            <div className="content">
                <img className="marker"
                src="/marker.jpg" alt="location" />
                <h3>{props.country}</h3>
                <a href={props.hrefs}>{props.links}</a>
                <p className="Date">{props.date}</p>
                <p className="content">{props.cs}</p>
                </div>"
        </article>
    )
}