const Restaurant = ({ res }) => {
    return (
        <>
            {res.place_name}<br></br>
            {res.category_name.slice(res.category_name.indexOf('>') + 2)}<br></br>
            <a href={res.place_url}>{res.place_url}</a>
        </>
    )
}

export default Restaurant;