exports.formatDate = (dateString) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
};