export const parseEventDate = (date: string): Date => {
    const parsedDate = new Date(date);
    return parsedDate;
}

export const eventDateToSlovenian = (date: string): string => {
    const datetime = new Date(date);
    const day = datetime.getDate();
    const month = datetime.getMonth() + 1; // datetime.toLocaleString('sl-SI', { month: 'long' });
    const year = datetime.getFullYear();
    const hours = datetime.getHours().toString()
    const minutes = datetime.getMinutes().toString().padStart(2, '0');
    //const seconds = datetime.getSeconds().toString().padStart(2, '0');

    const customFormattedDateTime = `${day}.${month}.${year} ob ${hours}:${minutes}`;
    return customFormattedDateTime;
}

export const eventDateToHtmlInput = (date: string): string => {
    const datetime = new Date(date);
    const day = datetime.getDate();
    const month = String(datetime.getMonth() + 1).padStart(2, '0'); // datetime.toLocaleString('sl-SI', { month: 'long' });
    const year = datetime.getFullYear();
    const hours = datetime.getHours().toString().padStart(2, '0')
    const minutes = datetime.getMinutes().toString().padStart(2, '0');
    //const seconds = datetime.getSeconds().toString().padStart(2, '0');

    const customFormattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return customFormattedDateTime;
}
