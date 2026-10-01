import sanitizeHtml from "sanitize-html";

export const sanitizarTexto = (texto) => {
    if (typeof texto !== "string") return texto;
    return sanitizeHtml(texto, { allowedTags: [], allowedAttributes: {} }).trim();
};
