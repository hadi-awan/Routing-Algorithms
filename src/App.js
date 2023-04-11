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
import { isArrayLikeObject } from 'lodash';

let id = 0;
const getId = () => `${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [algoResult, setAlgoResult] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)), [] 
  );

  const onRunButtonClick = () => {
    let edges = reactFlowInstance.getEdges();
    for(let i = 0; i < edges.length; i++) {
      if(!edges[i].label){
        edges[i].label = 1;
        reactFlowInstance.setEdges(edges);
      }
    }
    let arr = createGrid();
    let {adjacencyMatrix, startNode} = arr;
    dijkstra(adjacencyMatrix, startNode);
  };

  function printSolutionDijkstra(graph, dist, visited, src, step) {
    let result = "";
    let r = "";

    // Creating the Header
    let dataOutput = "Step\t\t\t\tN'\t\t\t\t";
    for (let node in graph) {
      if (node != src && !visited.has(node)) {
        dataOutput += ("D(" + node + "),p(" + node + ")\t\t\t\t")
      }
    }
    console.log(dataOutput);

    for (let node in graph) {
      if (dist[node] == Infinity) {
        result += "∞\t\t\t\t\t";
      }
      else if (node != src && !visited.has(node)) {
        let minVal = Infinity;
        let minNode = null;
        for (let i of visited) {
          if (graph[i][node] < minVal) {
            minVal = graph[i][node];
            minNode = i;
          }
        }
        if (minNode == src) {
          result += dist[node]+","+src+"\t\t\t\t\t";
        }
        else {
          result += minVal+","+minNode+"\t\t\t\t\t";
        }
      }
    }
    console.log(step+'\t\t\t\t',...visited,'\t\t\t\t', result);
    r = dataOutput + "\n" + step + '\t\t\t\t' + Array.from(visited).join(' ') + '\t\t\t\t' + result + "\n";
    return r;
  };
  
  function dijkstra(graph, src) {
    // Initialization
    let result = "";
    let step = 0;
    let dist = {};
    for (let node in graph) {
      dist[node] = Infinity;
    }
    dist[src] = 0;
    
    // Initialize set of visited nodes
    let visited = new Set();

    // Loop until all nodes have been visited
    while (visited.size < Object.keys(graph).length) {
      // Find the unvisited node with the smallest distance
      let minDist = Infinity;
      let minNode = null;
      for (let node in dist) {
        if (!visited.has(node) && dist[node] < minDist) {
          minDist = dist[node];
          minNode = node;
        }  
      }
        // Add the node to the set of adjacent nodes
      visited.add(minNode);

        // Update distances to adjacent nodes
      for (let neighbor in graph[minNode]) {
        if (dist[neighbor] > 0) {
          let distance = graph[minNode][neighbor];
          let totalDistance = dist[minNode] + distance;
          if (totalDistance < dist[neighbor]) {
            dist[neighbor] = totalDistance;
          }
        }
      }
      src = minNode;
      result += printSolutionDijkstra(graph, dist, visited, src, step);
      step += 1;
    }
    setAlgoResult(result);
  };

  function createGrid(){
    var arr = new Array(id);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(id);
    }

    let edges = reactFlowInstance.getEdges();

    for(let i = 0; i < edges.length; i++) {
      // console.log(edges[i].source + " " + edges[i].target + " " + edges[i].label);
      let source = parseInt(edges[i].source);
      let target = parseInt(edges[i].target);
      let val = parseInt(edges[i].label);

      if(isNaN(val)) {
        val = 1;
      }

      arr[source][target] = val;
      arr[target][source] = val;

      // console.log(source + " " + target + " " + edges[i].label)
      //console.log(arr);
    };
    
    const startNode = parseInt(prompt("Enter the index of the start node: "));

    return {adjacencyMatrix: arr, startNode: startNode};
    
}

  const onUpdateButtonClick = (param) => {
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
          color: "#ffffff",
          borderRadius: '100%',
          backgroundColor: '#03befc',
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
      </ReactFlowProvider>
      <div className="Sidebar">
        <Sidebar 
            onRunButtonClick={onRunButtonClick}
            onUpdateButtonClick={onUpdateButtonClick}
            algoResult={algoResult}
        />
        </div>
    </div>
  );
};

export default DnDFlow;