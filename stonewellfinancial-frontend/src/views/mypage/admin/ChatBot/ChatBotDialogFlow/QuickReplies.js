import React from 'react';
import QuickReply from './QuickReply';

const QuickReplies = (props) => {

  function _handleClick(event, payload, text) {
      props.replyClick(event, payload, text);
  }


  function renderQuickReply(reply, i) {
      return <QuickReply key={i} click={_handleClick} reply={reply} />;
  }

//   const renderQuickReply = (reply) => {
//     if (reply.structValue.fields.payload) {
//         return (
//             <a style={{ margin: 3}} href="/" 
//                 className="btn-floating btn-large waves-effect waves-light red"
//                 onClick={(event) =>
//                   props.click(
//                     event,
//                     props.reply.structValue.fields.payload.stringValue,
//                     props.reply.structValue.fields.text.stringValue
//                 )
//                 }>
//                 {reply.structValue.fields.text.stringValue}
//             </a>
//         );
//     } else {
//         return (
//             <a style={{ margin: 3}} 
//                 href={reply.structValue.fields.link.stringValue} target="_blank"  rel="noreferrer"
//             >
//                 {reply.structValue.fields.text.stringValue}
//             </a>
//         );
//     }

// };


  const renderQuickReplies = (quickReplies) => {
      if (quickReplies) {
          return quickReplies.map((reply, i) => {
                  return renderQuickReply(reply, i);
              }
          )
      } else {
          return null;
      }
  }

  return (
      <div className="col s12 m8 offset-m2 l6 offset-l3">
          <div className="card-panel grey lighten-5 z-depth-1">
              <div className="row valign-wrapper">
                  {/* <div className="col s2">
                      <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                  </div> */}
                  <div id="quick-replies" className="col s10">
                      {props.text && <p>
                          {props.text.stringValue}
                      </p>
                      }
                      {renderQuickReplies(props.payload)}
                  </div>
              </div>
          </div>
      </div>
  );

}

export default QuickReplies;