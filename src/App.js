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
  const [algoResult, setAlgoResult] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
    );

  const onRunButtonClick = () => {
    let edges = reactFlowInstance.getEdges();
    for(let i = 0; i < edges.length; i++){
      if(!edges[i].label){
        edges[i].label = 1;
        reactFlowInstance.setEdges(edges);
      }
    }
    let arr = createGrid();


  for(var i = 0; i < arr.length; i++){
    console.log(arr[i]);
  }
  dijkstra(arr, 0);
  }

  function minDistance(dist, sptSet){
    // initialize min value
    let min = Number.MAX_VALUE;
    let min_index = -1;
    let V = id; 

    for(let v = 0; v < V; v++){
      if (sptSet[v] == false && dist[v] <= min)
        {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
  }

  function printSolution(dist)
  {


    let V = id;
    let dataOutput = "Vertex \t Distance from Source \n";
    for(let i = 0; i < V; i++)
    {
        dataOutput += (i + " \t\t " + dist[i] + "\n");
    }
    setAlgoResult(dataOutput);
  }

  function dijkstra(graph, src)
{
  let V = id;

    let dist = new Array(V);
    let sptSet = new Array(V);
     
    // Initialize all distances as
    // INFINITE and stpSet[] as false
    for(let i = 0; i < V; i++)
    {
        dist[i] = Number.MAX_VALUE;
        sptSet[i] = false;
    }
     
    // Distance of source vertex
    // from itself is always 0
    dist[src] = 0;
     
    // Find shortest path for all vertices
    for(let count = 0; count < V - 1; count++)
    {

        let u = minDistance(dist, sptSet);
         
        sptSet[u] = true;
         
        for(let v = 0; v < V; v++)
        {
             
            if (!sptSet[v] && graph[u][v] != 0 &&
                   dist[u] != Number.MAX_VALUE &&
                   dist[u] + graph[u][v] < dist[v])
            {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
     
    // Print the constructed distance array
    printSolution(dist);
}

function createGrid(){
  var arr = new Array(id);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(id);
  }

  for(var i = 0; i < arr.length; i++){
    for(var j = 0; j < arr.length; j++){
      arr[i][j] = 0;
    }
  }

  let edges = reactFlowInstance.getEdges();
  for(let i = 0; i < edges.length; i++){
    // console.log(edges[i].source + " " + edges[i].target + " " + edges[i].label);
    let source = parseInt(edges[i].source);
    let target = parseInt(edges[i].target);
    let val = parseInt(edges[i].label);

    if(isNaN(val)){
      val = 1;
    }

    arr[source][target] = val;
    arr[target][source] = val;
    // console.log(source + " " + target + " " + edges[i].label);

  }

  return arr;
  
}

  const onUpdateButtonClick = (param) =>{
    let edges = reactFlowInstance.getEdges();
    for(let i = 0; i < edges.length; i++){
      if (edges[i].selected){
        edges[i].label = param;
        reactFlowInstance.setEdges(edges);
      }
    }
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
        data: { label: `${id-1}` },
        ...nodeDefaults,
      };

      setNodes((nds) => nds.concat(newNode));
      myList.push(newNode);
      
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
            algoResult={algoResult}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
