/**
 * Removes the property at path of object.
 * @param object The object to modify
 * @param path The path of the property to unset
 */
export function unset(
  object: any,
  path: string | number | symbol | string[],
): boolean {
  if (!object || typeof object !== "object") {
    return true; // lodash.unset returns true for null/undefined
  }

  // Convert path to string array
  const pathArray = Array.isArray(path) ? path : String(path).split(".");

  if (pathArray.length === 0) {
    return true;
  }

  if (pathArray.length === 1) {
    const key = pathArray[0];
    if (key in object) {
      delete object[key];
      return true;
    }
    return true; // lodash.unset returns true even if key doesn't exist
  }

  const key = pathArray[0];
  const restPath = pathArray.slice(1);

  if (!(key in object)) {
    return true; // lodash.unset returns true even if path doesn't exist
  }

  return unset(object[key], restPath);
}
