const { createContext, useState, useContext } = require("react");

const LoadingContext = createContext();

const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;

export function useLoading() {
    return useContext(LoadingContext);
}