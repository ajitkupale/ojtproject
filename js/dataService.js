//FETCH MENU DATA
//-fetch menu items from local json file
//-handles network parsing errors safely

export async function fetchMenuData(){
    try{
        //send request to fetch menu data 
        const response = await
        fetch("data/menu.json");
        //check if response is successfull
        if(!response.ok)throw new
        error("failed to load menu");

        //parse and return json data 
        return await response.json();
    }catch(error){
        //log error for debugging
        console.error(error);

        //return empty array as fallback to prevent app crash
        return[];
    }
}