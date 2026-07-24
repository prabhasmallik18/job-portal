// Safe JSON parsing utility to prevent crashes
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    if (!jsonString) {
      return defaultValue;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('❌ JSON Parse Error:', error.message);
    return defaultValue;
  }
};

// Safe JSON stringify
export const safeJsonStringify = (obj, defaultValue = '{}') => {
  try {
    if (obj === null || obj === undefined) {
      return defaultValue;
    }
    return JSON.stringify(obj);
  } catch (error) {
    console.error('❌ JSON Stringify Error:', error.message);
    return defaultValue;
  }
};

// Safe array operations
export const safeArrayMap = (array, callback, defaultValue = []) => {
  try {
    if (!Array.isArray(array)) {
      return defaultValue;
    }
    return array.map(callback);
  } catch (error) {
    console.error('❌ Array Map Error:', error.message);
    return defaultValue;
  }
};

export const safeArrayFilter = (array, callback, defaultValue = []) => {
  try {
    if (!Array.isArray(array)) {
      return defaultValue;
    }
    return array.filter(callback);
  } catch (error) {
    console.error('❌ Array Filter Error:', error.message);
    return defaultValue;
  }
};

// Safe property access
export const safeGet = (obj, path, defaultValue = null) => {
  try {
    const value = path.split('.').reduce((current, prop) => current?.[prop], obj);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.error('❌ Property Access Error:', error.message);
    return defaultValue;
  }
};
