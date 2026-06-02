import { Group, Condition, QueryNode } from '../types/query';

// Type guards
export const isGroup = (node: QueryNode): node is Group => {
  return 'logic' in node && 'children' in node;
};

export const isCondition = (node: QueryNode): node is Condition => {
  return 'field' in node && 'operator' in node;
};

// Tree Traversal Utility
export const traverseTree = (node: QueryNode, callback: (n: QueryNode) => void) => {
  callback(node);
  if (isGroup(node)) {
    node.children.forEach(child => traverseTree(child, callback));
  }
};

// Validation Engine
export const validateQueryTree = (node: QueryNode): string[] => {
  const errors: string[] = [];
  traverseTree(node, (n) => {
    if (isGroup(n) && n.children.length === 0) {
      errors.push(`Group ${n.id} is empty.`);
    }
    if (isCondition(n)) {
      if (!n.field) errors.push(`Condition ${n.id} is missing a field.`);
      if (n.value === undefined || n.value === '') errors.push(`Condition ${n.id} is missing a value.`);
      if (n.valueType === 'number' && isNaN(Number(n.value))) errors.push(`Condition ${n.id} expects a valid number.`);
    }
  });
  return errors;
};

// SQL Generator
export const generateSQL = (node: QueryNode): string => {
  if (isGroup(node)) {
    if (node.children.length === 0) return '';
    const childQueries = node.children.map(generateSQL).filter(Boolean);
    if (childQueries.length === 0) return '';
    if (childQueries.length === 1) return childQueries[0];
    return `(${childQueries.join(` ${node.logic} `)})`;
  } else {
    const { field, operator, value, valueType } = node;
    const formattedValue = ['string', 'date', 'enum'].includes(valueType) ? `'${value}'` : value;
    
    switch (operator) {
      case 'eq': return `${field} = ${formattedValue}`;
      case 'neq': return `${field} != ${formattedValue}`;
      case 'gt': return `${field} > ${formattedValue}`;
      case 'lt': return `${field} < ${formattedValue}`;
      case 'contains': return `${field} LIKE '%${value}%'`;
      case 'startsWith': return `${field} LIKE '${value}%'`;
      case 'in': return `${field} IN (${Array.isArray(value) ? value.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ') : value})`;
      case 'between': {
        const valArr = Array.isArray(value) ? value : ['', ''];
        return `${field} BETWEEN ${valArr[0]} AND ${valArr[1]}`;
      }
      default: return '';
    }
  }
};

// MongoDB Generator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateMongo = (node: QueryNode): Record<string, any> => {
  if (isGroup(node)) {
    if (node.children.length === 0) return {};
    const childQueries = node.children.map(generateMongo).filter(q => Object.keys(q).length > 0);
    if (childQueries.length === 0) return {};
    if (childQueries.length === 1) return childQueries[0];
    return { [`$${node.logic.toLowerCase()}`]: childQueries };
  } else {
    const { field, operator, value } = node;
    switch (operator) {
      case 'eq': return { [field]: value };
      case 'neq': return { [field]: { $ne: value } };
      case 'gt': return { [field]: { $gt: value } };
      case 'lt': return { [field]: { $lt: value } };
      case 'contains': return { [field]: { $regex: value, $options: 'i' } };
      case 'startsWith': return { [field]: { $regex: `^${value}`, $options: 'i' } };
      case 'in': return { [field]: { $in: Array.isArray(value) ? value : [value] } };
      case 'between': {
        const valArr = Array.isArray(value) ? value : ['', ''];
        return { [field]: { $gte: valArr[0], $lte: valArr[1] } };
      }
      default: return {};
    }
  }
};

// GraphQL Filter Generator (Hasura style)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateGraphQL = (node: QueryNode): Record<string, any> => {
  if (isGroup(node)) {
    if (node.children.length === 0) return {};
    const childQueries = node.children.map(generateGraphQL).filter(q => Object.keys(q).length > 0);
    if (childQueries.length === 0) return {};
    if (childQueries.length === 1) return childQueries[0];
    return { [`_${node.logic.toLowerCase()}`]: childQueries };
  } else {
    const { field, operator, value } = node;
    switch (operator) {
      case 'eq': return { [field]: { _eq: value } };
      case 'neq': return { [field]: { _neq: value } };
      case 'gt': return { [field]: { _gt: value } };
      case 'lt': return { [field]: { _lt: value } };
      case 'contains': return { [field]: { _ilike: `%${value}%` } };
      case 'startsWith': return { [field]: { _ilike: `${value}%` } };
      case 'in': return { [field]: { _in: Array.isArray(value) ? value : [value] } };
      default: return {};
    }
  }
};

// Evaluate query locally against a dataset
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const evaluateQuery = (dataset: any[], node: QueryNode): any[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evaluateNode = (item: any, n: QueryNode): boolean => {
    if (isGroup(n)) {
      if (n.children.length === 0) return true; // Empty group matches everything
      if (n.logic === 'AND') {
        return n.children.every(child => evaluateNode(item, child));
      } else {
        return n.children.some(child => evaluateNode(item, child));
      }
    } else {
      const { field, operator, value } = n;
      if (!field || value === undefined || value === '') return true; // Incomplete rule matches everything
      const itemValue = item[field];
      
      switch (operator) {
        case 'eq': return itemValue == value;
        case 'neq': return itemValue != value;
        case 'gt': return Number(itemValue) > Number(value) || new Date(String(itemValue)) > new Date(String(value));
        case 'lt': return Number(itemValue) < Number(value) || new Date(String(itemValue)) < new Date(String(value));
        case 'contains': return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        case 'startsWith': return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
        case 'in': return Array.isArray(value) ? value.includes(itemValue) : false;
        case 'between': {
          const min = Array.isArray(value) ? value[0] : null;
          const max = Array.isArray(value) ? value[1] : null;
          if (min && max) {
             const val = isNaN(Number(itemValue)) ? new Date(String(itemValue)).getTime() : Number(itemValue);
             const mn = isNaN(Number(min)) ? new Date(String(min)).getTime() : Number(min);
             const mx = isNaN(Number(max)) ? new Date(String(max)).getTime() : Number(max);
             return val >= mn && val <= mx;
          }
          return true;
        }
        default: return true;
      }
    }
  };

  return dataset.filter(item => evaluateNode(item, node));
};
