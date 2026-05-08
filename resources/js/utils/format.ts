export const formatDisplay = (val: string | number) => {
    if (val === '' || val === 0 || val === '0') {
        return '';
    }

    const parts = val.toString().split('.');
    const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.length > 1 ? `${integer},${parts[1]}` : integer;
};

export const parseDisplay = (val: string) => {
    // Remove dots (thousands) and replace comma with dot (decimal)
    return val.replace(/\./g, '').replace(',', '.');
};
