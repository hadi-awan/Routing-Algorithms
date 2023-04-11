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
  const [algoResultDijkstra, setAlgoResultDijkstra] = useState(null);
  const [algoResultDistanceVector, setAlgoResultDistanceVector] = useState(null);

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
    let network = create_network(adjacencyMatrix);
    let dv = distance_vector(network);
    let dist = calculate_distance(adjacencyMatrix, startNode);
    printSolutionDistanceVector(dist, dv);
  };

  function minDistance(dist, sptSet) {
    // initialize min value
    let min = Number.MAX_VALUE;
    let min_index = -1;
    let V = id; 

    for(let v = 0; v < V; v++){
      if (sptSet[v] == false && dist[v] <= min) {
          min = dist[v];
          min_index = v;
      }
    }
    return min_index;
  };

  function printSolutionDistanceVector(dist, dv) {
    let V = id;
    let dataOutput = "Vertex \t Distance from Source \n";
    for(let i = 0; i < V; i++) {
      dataOutput += (i + " \t\t " + dist[i] + "\n");
    }
    dataOutput += "\nDistance Vector Routing Table\n\n \t";
    
    let len = Object.keys(dv).length;
    for (let i = 0; i<len; i++){
      dataOutput+= (Object.keys(dv)[i] + "\t");
    }
    dataOutput+="\n"
    for(let i = 0; i < len; i++){
      dataOutput+= (Object.keys(dv)[i] + "\t");
        for(let j = 0; j < len; j++){
          if (dv[i][j] == undefined || dv[i][j] == "Infinity")
            dataOutput += ("-"+ "\t")
          else
            dataOutput += (dv[i][j]+ "\t")
        }
      dataOutput+= ("\n");
    }
    setAlgoResultDistanceVector(dataOutput);
  };

  function calculate_distance(graph, src) {
    let V = id;
    let dist = new Array(V);
    let sptSet = new Array(V);
     
    // Initialize all distances as
    // INFINITE and stpSet[] as false
    for(let i = 0; i < V; i++) {
        dist[i] = Number.MAX_VALUE;
        sptSet[i] = false;
    }
     
    // Distance of source vertex
    // from itself is always 0
    dist[src] = 0;
     
    // Find shortest path for all vertices
    for(let count = 0; count < V - 1; count++) {
        let u = minDistance(dist, sptSet);
         
        sptSet[u] = true;
         
        for(let v = 0; v < V; v++) {
             
            if (!sptSet[v] && graph[u][v] != 0 &&
                   dist[u] != Number.MAX_VALUE &&
                   dist[u] + graph[u][v] < dist[v])
            {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
     
    // Print the constructed distance array
    return dist;
};

function distance_vector(network, max_iterations=100) {
  // Initialize distance vector for each node
  let distance_vectors = {};
  for (let node in network) {
    distance_vectors[node] = {};
    for (let neighbour in network[node]) {
      distance_vectors[node][neighbour] = network[node][neighbour];
    }
    for (let other_node in network) {
      if (other_node != node && !(other_node in network[node])) {
        distance_vectors[node][other_node] = Infinity;
      }
    }
  }

  // Iteratively update distance vectors
  for (let i = 0; i < max_iterations; i++) {
    let converged = true;
    for (let node in network) {
      // Update distance vector for node
      let old_distance_vector = Object.assign({}, distance_vectors[node]);
      for (let neighbour in network[node]) {
        for (let dest in distance_vectors) {
          if (dest != node && dest != neighbour) {
            let new_cost = distance_vectors[node][neighbour] +
                           distance_vectors[neighbour][dest];
            if (new_cost < distance_vectors[node][dest]) {
              distance_vectors[node][dest] = new_cost;
            }
          }
        }
      }
      if (!Object.is(distance_vectors[node], old_distance_vector)) {
        converged = false;
      }
    }
    if (converged) {
      break;
    }
  }
  return distance_vectors;
};

function create_network(arr){
  let nodes = {}
  for (let i = 0; i < arr.length; i++) {
    let edges = {}
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] !== 0)
        edges[j] = arr[i][j]
    }
    nodes[i] = edges
  }
  return nodes;
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
    setAlgoResultDijkstra(result);
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
            
            algoResultDijkstra={algoResultDijkstra}
            algoResultDistanceVector={algoResultDistanceVector}
        />
        </div>
    </div>
  );
};

export default DnDFlow;