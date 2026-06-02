import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Group, Condition, QueryNode, ValueType } from '../types/query';

interface QueryState {
  queryTree: Group;
  addGroup: (parentId: string) => void;
  addCondition: (parentId: string, initialField?: string, initialType?: ValueType) => void;
  removeNode: (id: string) => void;
  updateCondition: (id: string, updates: Partial<Condition>) => void;
  updateGroupLogic: (id: string, logic: 'AND' | 'OR') => void;
  toggleGroupCollapse: (id: string) => void;
  setQueryTree: (tree: Group) => void;
  clearQueryTree: () => void;
  moveNode: (activeId: string, overId: string) => void;
  history: Group[];
  historyIndex: number;
  presets: Record<string, Group>;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
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

export const useQueryStore = create<QueryState>()(
  persist(
    (set) => ({
      queryTree: createEmptyGroup(),
      history: [createEmptyGroup()],
      historyIndex: 0,
      presets: {},
      
      setQueryTree: (tree) => set((state) => {
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), tree];
        return { 
          queryTree: tree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),
      
      clearQueryTree: () => set((state) => {
        const newTree = createEmptyGroup();
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), newTree];
        return { 
          queryTree: newTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),

      pushHistory: () => set((state) => {
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), state.queryTree];
        return { history: newHistory, historyIndex: newHistory.length - 1 };
      }),

      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          return {
            queryTree: state.history[newIndex],
            historyIndex: newIndex,
          };
        }
        return state;
      }),

      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          return {
            queryTree: state.history[newIndex],
            historyIndex: newIndex,
          };
        }
        return state;
      }),

      savePreset: (name) => set((state) => ({
        presets: { ...state.presets, [name]: state.queryTree }
      })),

      loadPreset: (name) => set((state) => {
        const preset = state.presets[name];
        if (preset) {
          const newHistory = [...state.history.slice(0, state.historyIndex + 1), preset];
          return { 
            queryTree: preset,
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        }
        return state;
      }),

      addGroup: (parentId) => set((state) => {
        const nextTree = recursivelyUpdateNode(state.queryTree, parentId, (group) => {
          group.children.push(createEmptyGroup());
        }) as Group;
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), nextTree];
        return { 
          queryTree: nextTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),

      addCondition: (parentId, initialField, initialType) => set((state) => {
        const nextTree = recursivelyUpdateNode(state.queryTree, parentId, (group) => {
          group.children.push(createEmptyCondition(initialField, initialType));
          group.isCollapsed = false;
        }) as Group;
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), nextTree];
        return {
          queryTree: nextTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),

      removeNode: (id) => set((state) => {
        let nextTree;
        if (id === state.queryTree.id) {
          nextTree = createEmptyGroup();
        } else {
          nextTree = recursivelyRemoveNode(state.queryTree, id);
        }
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), nextTree];
        return {
          queryTree: nextTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
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
        const nextTree = updateChild(state.queryTree) as Group;
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), nextTree];
        return { 
          queryTree: nextTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),

      updateGroupLogic: (id, logic) => set((state) => {
        const nextTree = recursivelyUpdateNode(state.queryTree, id, (group) => {
          group.logic = logic;
        }) as Group;
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), nextTree];
        return {
          queryTree: nextTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),

      toggleGroupCollapse: (id) => set((state) => ({
        queryTree: recursivelyUpdateNode(state.queryTree, id, (group) => {
          group.isCollapsed = !group.isCollapsed;
        }) as Group,
      })),

      moveNode: (activeId, overId) => set((state) => {
        if (activeId === overId) return { queryTree: state.queryTree };

        let activeNode: QueryNode | null = null;

        const findAndRemove = (node: Group): Group => {
          const index = node.children.findIndex(c => c.id === activeId);
          if (index !== -1) {
            activeNode = node.children[index];
            const newChildren = [...node.children];
            newChildren.splice(index, 1);
            return { ...node, children: newChildren };
          }
          return {
            ...node,
            children: node.children.map(c => 'logic' in c ? findAndRemove(c) : c)
          };
        };

        const tempTree = findAndRemove(state.queryTree);
        if (!activeNode) return { queryTree: state.queryTree }; 

        let inserted = false;
        const insertNode = (node: Group): Group => {
          if (inserted) return node;

          if (node.id === overId) {
            inserted = true;
            return { ...node, children: [...node.children, activeNode!] };
          }

          const overIndex = node.children.findIndex(c => c.id === overId);
          if (overIndex !== -1) {
            inserted = true;
            const newChildren = [...node.children];
            newChildren.splice(overIndex, 0, activeNode!);
            return { ...node, children: newChildren };
          }

          return {
            ...node,
            children: node.children.map(c => 'logic' in c ? insertNode(c) : c)
          };
        };

        const newTree = insertNode(tempTree);
        if (!inserted) return { queryTree: state.queryTree };

        const newHistory = [...state.history.slice(0, state.historyIndex + 1), newTree];
        return { 
          queryTree: newTree,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),
    }),
    {
      name: 'query-patisserie-storage', // The magic memory chip!
    }
  )
);

