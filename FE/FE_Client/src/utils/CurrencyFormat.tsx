
type TCurrency = {
    price: number,
    discount?: number
}

const CurrencyFormat = (props: TCurrency) => {
    const finalPrice = props.discount ? props.price * (1 - props.discount / 100) : props.price;

    return (
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(
            finalPrice
        )
    )
}

export default CurrencyFormat;