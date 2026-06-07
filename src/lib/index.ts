export const generateRandomID = (): string => crypto.randomUUID();

export const getCurrentDate = (): string => {
    const date = new Date();

    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
