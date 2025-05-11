import { Navigate, useLocation } from "react-router-dom"
import LoadingSpinner from "../components/Shared/LoadingSpinner"
import useAuth from "../hooks/useAuth"
import PropTypes from "prop-types"
import useRole from "../hooks/useRole"

const SellerRoute = ({ children }) => {
    // const { user, loading } = useAuth()
    const [role, isLoading] = useRole()
    const location = useLocation()

    if (isLoading) return <LoadingSpinner />
    if (role === 'seller') return children
    return <Navigate to='/dashboard' state={{ from: location }} replace='true' />
}
SellerRoute.propTypes = {
    children: PropTypes.element,
}

export default SellerRoute;