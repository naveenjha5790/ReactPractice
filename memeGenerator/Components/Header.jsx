import troll from '../troll.jpeg';
export default function Header(){
    return (
        <header className="header">
            <img src={troll}
            />
            <h1>Meme Generator</h1>
        </header>
    )
}