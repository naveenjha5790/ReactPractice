import React from "react";
export default function IngrediantsList(props){
    
        const ingrediantsItems=props.ingrediants.map(ingrediant =>(
        <li key={ingrediant}>{ingrediant}</li>
    ));
    return (
        <section>
                <h2>Ingrediants on hand:</h2>
                <ul className="ingrediants-list" aria-label="polit">
                    {ingrediantsItems}
                </ul>
                <div className="get-recipe-container">
                    <h3>Ready for a recipe</h3>
                    <p>Generate a recipe from your list of ingrediants
                        </p> 
                </div>
                <button onClick={props.trs}>Get a recipe</button>
            </section>
    )
}
//