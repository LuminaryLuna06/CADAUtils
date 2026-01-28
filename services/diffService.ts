import * as deepDiff from 'deep-diff';

export type DiffType = 'added' | 'deleted' | 'modified' | 'array';

export interface JsonDiff {
  type: DiffType;
  path: string[];
  pathStr: string;
  lhs?: any; // left-hand side (original)
  rhs?: any; // right-hand side (modified)
  index?: number; // for array changes
  item?: any; // for array changes
}

/**
 * Calculate differences between two JSON objects
 */
export function calculateDiff(left: any, right: any): JsonDiff[] {
  const differences = deepDiff.diff(left, right);
  
  if (!differences) {
    return [];
  }

  return differences.map((diff, index) => {
    const path = diff.path || [];
    const typedDiff = diff as any; // Type assertion to access lhs/rhs
    
    return {
      type: getDiffType(diff),
      path,
      pathStr: path.join('.'),
      lhs: typedDiff.lhs,
      rhs: typedDiff.rhs,
      index,
      item: typedDiff.item,
    };
  });
}

/**
 * Get user-friendly diff type
 */
function getDiffType(diff: deepDiff.Diff<any, any>): DiffType {
  switch (diff.kind) {
    case 'N': // New property
      return 'added';
    case 'D': // Deleted property
      return 'deleted';
    case 'E': // Edited property
      return 'modified';
    case 'A': // Array change
      return 'array';
    default:
      return 'modified';
  }
}

/**
 * Get diff path as string
 */
export function getDiffPath(diff: JsonDiff): string {
  return diff.pathStr;
}

/**
 * Check if a path matches a diff
 */
export function isPathInDiff(path: string[], diff: JsonDiff): boolean {
  if (path.length !== diff.path.length) {
    return false;
  }
  
  return path.every((segment, index) => segment === String(diff.path[index]));
}

/**
 * Find diff by path
 */
export function findDiffByPath(diffs: JsonDiff[], path: string[]): JsonDiff | undefined {
  const pathStr = path.join('.');
  return diffs.find(diff => diff.pathStr === pathStr);
}

/**
 * Get color class for diff type
 */
export function getDiffColorClass(type: DiffType): string {
  switch (type) {
    case 'added':
      return 'diff-added';
    case 'deleted':
      return 'diff-deleted';
    case 'modified':
    case 'array':
      return 'diff-modified';
    default:
      return '';
  }
}
