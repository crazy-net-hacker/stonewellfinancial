import React from "react";

// text line break
export const textLineBreak = (text) => {
  if (!text){
    return('');
  }else{
    return(
      text.split('\n')
          .map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                {item}
                <br />
              </React.Fragment>
            )
          })
    );
  }
}
