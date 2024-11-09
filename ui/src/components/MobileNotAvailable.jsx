function MobileNotAvailable() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-xs">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sorry!</h2>
                <p className="text-gray-600 mb-4">
                    This site is currently not available on mobile devices.
                </p>
                <p className="text-sm text-gray-500">
                    Please try accessing it on a desktop for the best experience.
                </p>
            </div>
        </div>
    );
};

export default MobileNotAvailable;
