import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { MdArrowBackIos } from "react-icons/md";

const TitleSection = ({ text, nav }) => {
    const navigate = useNavigate()
    return (
        <>
            <div className="w-full flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-bg-primary text-2xl cursor-pointer hover:text-gray-500 transition-all"
                >
                    <MdArrowBackIos />
                </button>
                <span className="text-2xl font-TextFontMedium text-bg-primary">{text}</span>
            </div>
        </>
    )
}

export default TitleSection;