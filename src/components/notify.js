import { Bounce, Flip, Slide, ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify=(msg="Some msg",type="info",pos="bottom-center",duration=4000) => {  
    toast[type](`${msg}` ,{
      position: pos,
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition:Slide,
      });
    
    }

    export default notify