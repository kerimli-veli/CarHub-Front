import chevronLeft from '../../assets/images/chevron-right.svg'
import chevronRight from '../../assets/images/chevron-left.svg'
const Button = ({ direction }) => {
    const toRight = direction === "right"

    return (
        <button
            onClick={() =>
                document
                    .querySelector("#movie-card-container")
                    .scrollBy({ left: toRight ? 220 : -220, behavior: "smooth" })
            }
            className={`z-10 absolute ${toRight ? "-right-0" : "-left-0"} top-40 hidden md:flex items-center justify-center bg-zinc-900 h-28
            hover:bg-zinc-800  duration-200 p-2 rounded-full`}
        >
            <img src={toRight ? chevronRight : chevronLeft} alt="" />
        </button>
    )
}

export default Button