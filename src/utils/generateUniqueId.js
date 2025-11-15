let idCounter = 0;

export const generateUniqueId = () => {
    return `${Date.now()}-${idCounter++}`;
};