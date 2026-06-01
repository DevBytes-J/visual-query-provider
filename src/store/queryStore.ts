import { create } from 'zustand';
import { Group, Condition, QueryNode, ValueType } from '../types/query';

interface QueryState {
  queryTree: Group;
  addGroup: (parentId: string) => void;
  addCondition: (parentId: string, initialField?: string, initialType?: ValueType) => void;
  removeNode: (id: string, parentId: string) => void;
  updateCondition: (id: string, updates: Partial<Condition>) => void;
  updateGroupLogic: (id: string, logic: 'AND' | 'OR') => void;
  toggleGroupCollapse: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createEmptyGroup = (): Group => ({
  id: generateId(),
  logic: 'AND',
  children: [],
  isCollapsed: false,
});

const createEmptyCondition = (initialField?: string, initialType?: ValueType): Condition => ({
  id: generateId(),
  field: initialField || '',
  operator: 'eq',
  value: '',
  valueType: initialType || 'string',
});

// Helper to recursively update the tree
const recursivelyUpdateNode = (
  node: QueryNode,
  targetId: string,
  updateFn: (node: Group) => void
): QueryNode => {
  if ('logic' in node) { // isGroup
    if (node.id === targetId) {
      updateFn(node);
      return { ...node };
    }
    return {
      ...node,
      children: node.children.map(child => recursivelyUpdateNode(child, targetId, updateFn)),
    };
  }
  return node;
};

// Helper to recursively remove a node
const recursivelyRemoveNode = (node: Group, targetId: string): Group => {
  return {
    ...node,
    children: node.children
      .filter(child => child.id !== targetId)
      .map(child => ('logic' in child ? recursivelyRemoveNode(child, targetId) : child)),
  };
};

export const useQueryStore = create<QueryState>((set) => ({
  queryTree: createEmptyGroup(),
  
  addGroup: (parentId) => set((state) => ({
    queryTree: recursivelyUpdateNode(state.queryTree, parentId, (group) => {
      group.children.push(createEmptyGroup());
    }) as Group,
  })),

  addCondition: (parentId, initialField, initialType) => set((state) => ({
    queryTree: recursivelyUpdateNode(state.queryTree, parentId, (group) => {
      group.children.push(createEmptyCondition(initialField, initialType));
      group.isCollapsed = false; // Auto-expand when adding
    }) as Group,
  })),

  removeNode: (id, parentId) => set((state) => {
    // If we are removing the root, just reset it
    if (id === state.queryTree.id) {
      return { queryTree: createEmptyGroup() };
    }
    return {
      queryTree: recursivelyRemoveNode(state.queryTree, id),
    };
  }),

  updateCondition: (id, updates) => set((state) => {
    const updateChild = (node: QueryNode): QueryNode => {
      if ('field' in node && node.id === id) {
        return { ...node, ...updates };
      }
      if ('logic' in node) {
        return {
          ...node,
          children: node.children.map(updateChild),
        };
      }
      return node;
    };
    return { queryTree: updateChild(state.queryTree) as Group };
  }),

  updateGroupLogic: (id, logic) => set((state) => ({
    queryTree: recursivelyUpdateNode(state.queryTree, id, (group) => {
      group.logic = logic;
    }) as Group,
  })),

  toggleGroupCollapse: (id) => set((state) => ({
    queryTree: recursivelyUpdateNode(state.queryTree, id, (group) => {
      group.isCollapsed = !group.isCollapsed;
    }) as Group,
  })),
}));
