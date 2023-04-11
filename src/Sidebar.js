import React, { useRef } from 'react';

export default (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const inputRef = useRef(null);

  return (
    <aside>
      <head>
      <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossorigin="anonymous"
        />
      </head>
      <h3 style={{ width: 400 }}>Routing Protocols</h3>
      <br></br>
      <button type="button" class="btn btn-outline-success" onClick={props.onRunButtonClick} style={{ width: 400 }}>Run</button>
      <br></br>
      <br></br>
      <div class="input-group mb-3" style={{ width: 400 }}>
              <input
                type="integer"
                class="form-control"
                placeholder="Edge Weight"
                aria-label="Edge Weight"
                aria-describedby="basic-addon2"
                ref = {inputRef}
              />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" onClick={
                 () => {
                  props.onUpdateButtonClick(inputRef.current.value)
                 }
                } >
                  Update
                </button>
                
                </div>
            </div>
            <br></br>
            <br></br>
      <div className="description" style={{ width: 400 }}>You can drag these nodes to the pane on the right.</div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable style={{ width: 400 }}>
        Node
      </div>
      <br></br>
      
      <div style={{ width: 1000 }}>
      <text style={{'white-space': 'pre-wrap'}}>{
        props.algoResult && props.algoResult     
      }</text>
      </div>

    </aside>
  );
};
