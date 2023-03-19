import React from 'react';

export default (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

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
      <h3>Dijkstra's Algorithm</h3>
      <br></br>
      <button type="button" class="btn btn-outline-success" onClick={props.onRunButtonClick}>
              Run
      </button>
      <br></br>
            <br></br>
      <div class="input-group mb-3" style={{ width: 200 }}>
              <input
                type="text"
                class="form-control"
                placeholder="Edge Weight"
                aria-label="Edge Weight"
                aria-describedby="basic-addon2"
              />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" onClick={props.onUpdateButtonClick}>
                  Update
                </button>
                
                </div>
            </div>
            <br></br>
            <br></br>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Start Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        End Node
      </div>
    </aside>
    
  );
};
