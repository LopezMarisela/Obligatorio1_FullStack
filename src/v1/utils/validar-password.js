import bcrypt from "bcryptjs";

const salt = 12;

export const hashear = async (password) => {
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const compararPassword = async (password, hash) => {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
};