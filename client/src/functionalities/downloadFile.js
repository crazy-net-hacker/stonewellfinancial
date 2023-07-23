// download a pdf file from aws s3
export const download = (blob, name) => {
     // Convert your blob into a Blob URL 
     const blobUrl = URL.createObjectURL(blob);
     // Create a link element
     const link = document.createElement('a');
     // Set link's href to point to the Blob URL
     link.href = blobUrl;
     link.download = name;
     // Append link to the body
     document.body.appendChild(link);
     link.click();
     // Remove link from body
     // document.body.removeChild(link);

     return(false)
};

