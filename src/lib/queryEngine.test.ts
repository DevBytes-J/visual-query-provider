import { describe, it, expect } from 'vitest';
import { evaluateQuery, generateSQL, validateQueryTree } from './queryEngine';
import { Group } from '../types/query';

describe('Query Engine', () => {
  const mockData = [
    { name: 'Apple', price: 2, status: 'Fresh' },
    { name: 'Banana', price: 1, status: 'Ripe' },
    { name: 'Cherry', price: 5, status: 'Fresh' },
  ];

  it('evaluates simple equals condition', () => {
    const query: Group = {
      id: 'g1',
      logic: 'AND',
      children: [
        { id: 'c1', field: 'status', operator: 'eq', value: 'Fresh', valueType: 'string' }
      ]
    };
    const results = evaluateQuery(mockData, query);
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Apple');
    expect(results[1].name).toBe('Cherry');
  });

  it('evaluates AND logic correctly', () => {
    const query: Group = {
      id: 'g1',
      logic: 'AND',
      children: [
        { id: 'c1', field: 'status', operator: 'eq', value: 'Fresh', valueType: 'string' },
        { id: 'c2', field: 'price', operator: 'gt', value: 3, valueType: 'number' }
      ]
    };
    const results = evaluateQuery(mockData, query);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Cherry');
  });

  it('evaluates OR logic correctly', () => {
    const query: Group = {
      id: 'g1',
      logic: 'OR',
      children: [
        { id: 'c1', field: 'name', operator: 'eq', value: 'Banana', valueType: 'string' },
        { id: 'c2', field: 'price', operator: 'gt', value: 4, valueType: 'number' }
      ]
    };
    const results = evaluateQuery(mockData, query);
    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('Banana');
    expect(results[1].name).toBe('Cherry');
  });

  it('generates correct SQL', () => {
    const query: Group = {
      id: 'g1',
      logic: 'AND',
      children: [
        { id: 'c1', field: 'status', operator: 'eq', value: 'Fresh', valueType: 'string' },
        { id: 'c2', field: 'price', operator: 'gt', value: 3, valueType: 'number' }
      ]
    };
    const sql = generateSQL(query);
    expect(sql).toBe("(status = 'Fresh' AND price > 3)");
  });

  it('validates incomplete query tree', () => {
    const query: Group = {
      id: 'g1',
      logic: 'AND',
      children: [
        { id: 'c1', field: '', operator: 'eq', value: '', valueType: 'string' }
      ]
    };
    const errors = validateQueryTree(query);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('missing a field');
  });
});
