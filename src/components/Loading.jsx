import React from 'react';
import ReactLoading from 'react-loading';
 
const Loading = ({height,width}) => (
    <ReactLoading type="spokes" color="white" height={height || "90%"} width={width || "90%"} className='text-center mx-3 ' />
);
 
export default Loading;