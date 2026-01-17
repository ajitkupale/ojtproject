/* =========================================================
   FETCH MENU DATA
   - Fetches menu items from local JSON file
   - Handles network and parsing errors safely
   ========================================================= */

   export async function fetchMenuData() {
    try{
        //send request to featch menu data
        const response = await fetch("data/menu.json");

        //check if response is successful
        if (!response.ok) throw new Error("Faild to load menu");

        //parse and return JSON data
        return await response.json();
    
    } catch(error) {
        //log error for debugging 
        console.error(error);

        //return empty array as falback to prevent app crush 
        return [];
    }
    
   }