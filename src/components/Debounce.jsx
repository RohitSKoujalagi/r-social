import { useState,useEffect } from "react"

export const useDebounce=(value,delay=500)=>{
    const [debounceValue,setDebounceValue]=useState(value);
    const [isEmpty,setIsEmpty]=useState(false);

    useEffect(() => {
      const timeout=setTimeout(()=>{
        setDebounceValue(value);
      },delay)
      
      return () => {
        clearTimeout(timeout);
        // if(debounceValue==="")
        // {
        //   setIsEmpty(true);
        // }
      }


    }, [value,delay])
    
    return [debounceValue,isEmpty,setIsEmpty]          
    ;
} 


