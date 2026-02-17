/**
 * 404 Page Not Found Component
 * Minimalist design matching reference UI
 * Data mapped from data.pageNotFound.json
 */

import { Link } from 'react-router-dom';
import pageNotFoundData from '../Data/data.pageNotFound.json';

const PageNotFound = () => {
    const { code, actions } = pageNotFoundData.page_404;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="flex items-center gap-8">
                {/* 404 Number */}
                <h1 className="text-6xl font-medium text-gray-900">
                    {code.number || 404}
                </h1>

                {/* Vertical Divider */}
                <div className="h-16 w-px bg-gray-300"></div>

                {/* Message and Action */}
                <div className="flex flex-col gap-4">
                    <p className="text-lg text-gray-700">
                        {code.title || "I searched every ticket in the knowledge base... ran through all models... even tried the fallback chain. This page simply does not exist. Let me redirect you somewhere I can actually help."}
                    </p>
                    <Link
                        to={actions.primary.href}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                    >
                        {actions.primary.label || "← Back to Dashboard"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
