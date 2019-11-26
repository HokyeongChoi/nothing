const getTime = (date) => {
    if (date.length === 0) {
        return 0;
    }
    return date[date.length - 1].year * 400 + date[date.length - 1].month * 31 + date[date.length - 1].day;
}

export default getTime;