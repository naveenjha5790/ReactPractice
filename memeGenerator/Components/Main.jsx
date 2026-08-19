import React from "react";
export default function Main(){
    const obj1={
        topText:"One does not simply",
        bottomText:"Walk into Mordor",
        imageUrl:"http://i.imgflip.com/1bij.jpg"
    };
    const [obj,setObj]=React.useState(obj1);
    const [meme,setMeme]=React.useState([]);
    React.useEffect(()=>{
        fetch("https://api.imgflip.com/get_memes")
        .then(res=>res.json())
        .then(data=>setMeme(data.data.memes))
    },[]);
    
    function getMemeImage(){
        const randomNo=Math.floor(Math.random() *meme.length);
        const newMemeUrl=meme[randomNo].url;
        setObj(prevs=>({
            ...prevs,
            imageUrl:newMemeUrl
        }))
    }
    
    function handleChange(event){
        const {name,value}=event.currentTarget;
        setObj(prevs=>({
            ...prevs,
            [name]:value
        }))
    }
    
    
    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder={obj.topText}
                        name="topText"
                        onChange={handleChange}
                        value={obj.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder={obj.bottomText}
                        name="bottomText"
                        onChange={handleChange}
                        value={obj.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={obj.imageUrl} />
                <span className="top">{obj.topText}</span>
                <span className="bottom">{obj.bottomText}</span>
            </div>
        </main>
    )
}