import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { CategoryContext } from "../contexts/CategoryContext";

export default function Categories(){
    const {categories, setCategories} = useContext(CategoryContext);
    const [newCat,setNewCat] = useState("");
    
    const DEFAULT_FILTERS = [
      "instrumental",
      "remix",
      "lyrics",
      "extended"
    ]

    useEffect(()=> {
      setCategories(DEFAULT_FILTERS);
    },[])
  
    function addCategory(event){
      event.preventDefault();

      setCategories([...categories, newCat]);
     
    }

    function removeCategory(index){
      setCategories(categories.filter((c,i)=> i !== index));
    }

    return (
        <div className="cat-container">
        <form onSubmit={addCategory} id="categoryForm">
          <label>Add Category</label>
          <fieldset>
            <input value={newCat} onChange={(event)=>setNewCat(event.target.value)}/>
            <input type="submit" value="Add"/>
          </fieldset>
        </form>
  
        <button className='cat' onClick={() => setCategories(DEFAULT_FILTERS)}>🔃 Reset Categories</button>
        {
          categories.map((cat,index) => {
            return <button key={index} className='cat' onClick={()=> removeCategory(index)}>✖ {cat}</button>;
          })
        }
        </div>
      )
}