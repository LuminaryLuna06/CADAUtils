import jsYaml from "js-yaml";
import Papa from "papaparse";

export type DataFormat = "json" | "yaml" | "csv";

export const convertData = (
  data: string,
  from: DataFormat,
  to: DataFormat
): string => {
  let jsonObj: any;

  // Step 1: Parse Input to JS Object
  try {
    switch (from) {
      case "json":
        jsonObj = JSON.parse(data);
        break;
      case "yaml":
        jsonObj = jsYaml.load(data);
        break;
      case "csv":
        const csvResult = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
        });
        if (csvResult.errors.length > 0)
          throw new Error(`CSV Parse Error: ${csvResult.errors[0].message}`);
        jsonObj = csvResult.data;
        break;
    }
  } catch (e: any) {
    throw new Error(`Failed to parse ${from.toUpperCase()}: ${e.message}`);
  }

  // Step 2: Convert JS Object to Output
  try {
    switch (to) {
      case "json":
        return JSON.stringify(jsonObj, null, 2);
      case "yaml":
        return jsYaml.dump(jsonObj);
      case "csv":
        // Papa.unparse expects array of objects or array of arrays
        if (Array.isArray(jsonObj)) {
          return Papa.unparse(jsonObj);
        } else {
          throw new Error(
            "Cannot convert non-array JSON object to CSV directly."
          );
        }
    }
  } catch (e: any) {
    throw new Error(`Failed to convert to ${to.toUpperCase()}: ${e.message}`);
  }
};

export const beautifyJson = (json: string): string => {
  const obj = JSON.parse(json);
  return JSON.stringify(obj, null, 2);
};

export const minifyJson = (json: string): string => {
  const obj = JSON.parse(json);
  return JSON.stringify(obj);
};

export const sortJsonKeys = (json: string): string => {
  const obj = JSON.parse(json);
  const sortedObj = sortObjectKeys(obj);
  return JSON.stringify(sortedObj, null, 2);
};

// Helper to recursively sort object keys
const sortObjectKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key) => {
        result[key] = sortObjectKeys(obj[key]);
        return result;
      }, {});
  }
  return obj;
};

export const escapeJson = (json: string): string => {
  return json
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
};

export const smartFormatJson = (json: string): string => {
  // Smart format: compact arrays/objects with primitive values only
  const obj = JSON.parse(json);
  return JSON.stringify(obj, null, 2).replace(
    /(\{[^{}[\]]*\}|\[[^\[\]{}]*\])/g,
    (match) => match.replace(/\s+/g, " ")
  );
};

export const compareJson = (
  left: string,
  right: string
): { areEqual: boolean; differences: string[] } => {
  try {
    const leftObj = JSON.parse(left);
    const rightObj = JSON.parse(right);
    const diffs: string[] = [];

    const compare = (a: any, b: any, path: string = "root") => {
      if (typeof a !== typeof b) {
        diffs.push(`${path}: type mismatch`);
        return;
      }

      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          diffs.push(`${path}: array length differs`);
        }
        a.forEach((item, i) => compare(item, b[i], `${path}[${i}]`));
      } else if (typeof a === "object" && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        const allKeys = new Set([...keysA, ...keysB]);

        allKeys.forEach((key) => {
          if (!(key in a)) {
            diffs.push(`${path}.${key}: missing in left`);
          } else if (!(key in b)) {
            diffs.push(`${path}.${key}: missing in right`);
          } else {
            compare(a[key], b[key], `${path}.${key}`);
          }
        });
      } else if (a !== b) {
        diffs.push(`${path}: value differs`);
      }
    };

    compare(leftObj, rightObj);
    return { areEqual: diffs.length === 0, differences: diffs };
  } catch (e: any) {
    throw new Error(`Failed to compare JSON: ${e.message}`);
  }
};

export const downloadJson = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readJsonFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        // Validate JSON
        JSON.parse(content);
        resolve(content);
      } catch (err) {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
