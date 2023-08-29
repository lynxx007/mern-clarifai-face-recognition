import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h2>
                <p className="text-gray-600 mt-4">Sorry, the page you're looking for does not exist.</p>
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    );
};

export default NotFound;