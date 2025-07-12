export default function currencyConverter(x) {
    let num = typeof x === "string" ? parseFloat(x) : x;
    if (isNaN(num)) return "Invalid number";
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
