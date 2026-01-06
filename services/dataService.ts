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
