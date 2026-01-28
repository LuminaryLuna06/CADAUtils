import _ from "lodash";

export interface TransformResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Execute a JSON transformation query using lodash functions
 * Supports:
 * - Direct property access: data.features
 * - Lodash functions: filter(data.users, user => user.id === 1)
 * - Common functions: get, filter, map, pick, omit, groupBy, uniq, sortBy, orderBy, etc.
 */
export const executeTransform = (
  data: any,
  query: string
): TransformResult => {
  if (!query || query.trim() === "") {
    return { success: false, error: "Query cannot be empty" };
  }

  try {
    // Create a safe context with lodash functions and the data
    const context = {
      data,
      // Lodash functions
      get: _.get,
      filter: _.filter,
      map: _.map,
      pick: _.pick,
      omit: _.omit,
      groupBy: _.groupBy,
      uniq: _.uniq,
      sortBy: _.sortBy,
      orderBy: _.orderBy,
      find: _.find,
      findIndex: _.findIndex,
      reduce: _.reduce,
      flatten: _.flatten,
      flattenDeep: _.flattenDeep,
      uniqBy: _.uniqBy,
      keyBy: _.keyBy,
      values: _.values,
      keys: _.keys,
      merge: _.merge,
      cloneDeep: _.cloneDeep,
      sum: _.sum,
      min: _.min,
      max: _.max,
      mean: _.mean,
      size: _.size,
      isEmpty: _.isEmpty,
      isArray: _.isArray,
      isObject: _.isObject,
      isString: _.isString,
      isNumber: _.isNumber,
      isBoolean: _.isBoolean,
      isNull: _.isNull,
      isUndefined: _.isUndefined,
      // Allow chaining
      chain: _.chain,
      // Expose lodash itself
      _: _,
    };

    // Create function that evaluates the query in the context
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);

    // Build the function with the query
    const func = new Function(
      ...contextKeys,
      `"use strict"; return (${query});`
    );

    // Execute with the context
    const result = func(...contextValues);

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Invalid query syntax",
    };
  }
};

/**
 * Format the transform result as JSON string
 */
export const formatTransformResult = (result: TransformResult): string => {
  if (!result.success) {
    return JSON.stringify({ error: result.error }, null, 2);
  }
  return JSON.stringify(result.data, null, 2);
};

/**
 * Get example queries for the UI
 */
export const getExampleQueries = (): string[] => {
  return [
    "data.features",
    "data.settings.darkMode",
    "pick(data.settings, ['darkMode', 'offline'])",
    "filter(data.users, user => user.role === 'admin')",
    "map(data.features, (f, i) => ({ id: i, name: f }))",
    "groupBy(data.users, 'role')",
    "sortBy(data.users, 'id')",
    "{ features: data.features, userCount: data.users.length }",
  ];
};
