import { Position } from 'reactflow';

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

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 200 },
    data: {
      label: 'Start',
    },
    ...nodeDefaults,
  },
  {
    id: '2',
    position: { x: 350, y: 200 },
    data: {
      label: 'Node',
    },
    ...nodeDefaults,
  },
  {
    id: '3',
    position: { x: 600, y: 200 },
    data: {
      label: 'End',
    },
    ...nodeDefaults,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: '3'
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    label: '7'
  },
];

export { initialEdges, initialNodes };
