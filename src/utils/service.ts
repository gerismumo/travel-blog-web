

export const truncateText = (text: string, length: number) => {
    return text.length > length ? { truncated: true, text: text.substring(0, length) + '...' } : { truncated: false, text };
};


export const TruncateContent = (text: string, length: number) => {
    return text.length > length? text.substring(0, length) + '...' : text;
}