
type TCurrency = {
    price: number,
}

const CurrencyFormat = (props: TCurrency) => {

    return (
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(
            props.price
        )
    )
}

export default CurrencyFormat;