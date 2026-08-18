import React from "react";
import Recommends from "./Recommends";
import IngrediantsList from "./IngrediantsList";
import { getRecipeFromMistral } from "../src/Ai";
export default function Main(){
    const [ingrediants,setIngrediants]=React.useState(["all the main spices"
            ,"pasta","Vegies","tomato paste"
        ]);
        const [recipieShown,setReceipieShown]=React.useState(false);
    async function trs(){
        //setReceipieShown(prevs=>!prevs);
    const generaedRecipie=await getRecipeFromMistral(ingrediants);
        console.log(generaedRecipie)
}
    
    
    /*function handleSubmit(event){
        event.preventDefault();

        const formData=new FormData(event.currentTarget);
        const newIngrediant=formData.get("ingrediant")
        setIngrediants(prevs=>[...prevs,newIngrediant])
        
    }
        for before React19*/
   function addIngrediant(formData){
    const newIngrediant=formData.get("ingrediant");
    setIngrediants(prevs=>[...prevs,newIngrediant]);
   }
    return (
        <main>
            <form action={addIngrediant}>
                <input aria-label="Add ingrediants" 
                placeholder="e.g. oregano"
                name="ingrediant" />
                <button>Add Ingrediants</button>
            </form>
            {ingrediants.length >0 && <IngrediantsList trs={trs}
            ingrediants={ingrediants} />}
            {recipieShown && <Recommends />}
        </main>
    )
}