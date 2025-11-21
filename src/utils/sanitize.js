/**
 * Recursively sanitizes an object based on a schema, ensuring data types are correct.
 * @param {object} data - The data object to sanitize (e.g., from an AI response).
 * @param {object} schema - The object representing the desired structure and types (e.g., initialDataState).
 * @returns {object} A new, sanitized data object.
 */
export const sanitizeData = (data, schema) => {
    if (!data || typeof data !== 'object' || !schema) {
        return data;
    }

    const sanitized = {};

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && Object.prototype.hasOwnProperty.call(schema, key)) {
            const schemaValue = schema[key];
            const dataValue = data[key];

            if (typeof schemaValue === 'number') {
                sanitized[key] = parseFloat(dataValue) || 0; // Fallback to 0 if parsing fails
            } else if (typeof schemaValue === 'object' && schemaValue !== null && !Array.isArray(schemaValue)) {
                sanitized[key] = sanitizeData(dataValue, schemaValue); // Recurse into nested objects
            } else {
                sanitized[key] = dataValue; // Keep strings, booleans, arrays as they are
            }
        }
    }
    return sanitized;
};