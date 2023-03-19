import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';

import { initialEdges, initialNodes } from './nodes-and-edges';

let id = 0;
const getId = () => `${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)), []
    );

  const onRunButtonClick = () => {
    let edges = reactFlowInstance.getEdges();
    console.log(edges[0].selected)
    for(let i = 0; i < edges.length; i++){
      if (edges[i].selected){
        edges[i].label = 5;
        reactFlowInstance.setEdges(edges);
      }
    }
    console.log(edges[0]);
  }

  const onUpdateButtonClick = (param) =>{
    let edges = reactFlowInstance.getEdges();
    console.log(edges[0].selected)
    for(let i = 0; i < edges.length; i++){
      if (edges[i].selected){
        edges[i].label = 3;
        reactFlowInstance.setEdges(edges);
      }
    }
    console.log(edges[0]);
  }
    

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  var myList = new Array();

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeDefaults = {
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          borderRadius: '100%',
          backgroundColor: '#fff',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${id}` },
        ...nodeDefaults,
      };

      setNodes((nds) => nds.concat(newNode));
      myList.push(newNode);
      for(var i = 0; i< myList.length; i++){
        console.log(myList[i]);
      }
    },
    [reactFlowInstance]
  );

  return (
    
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar 
            onRunButtonClick={onRunButtonClick}
            onUpdateButtonClick={onUpdateButtonClick}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
