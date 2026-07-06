const generateRandomID = (): string => crypto.randomUUID();

const getCurrentDate = (): string => {
    const date = new Date();

    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const generateRandomHexColor = (): string => {
    const hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");
    return `#${hex}`;
};

export { generateRandomID, getCurrentDate, generateRandomHexColor };
