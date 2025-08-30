
import { createContext, useContext, useState, useCallback } from "react";
import { getProperties } from "../services/PropertyService";

const RealEstateContext = createContext();

export const RealEstateProvider = ({ children }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        searchTerm: "",
        propertyTypeId: "",
        propertyStatusId: "",
        minPrice: "",
        maxPrice: "",
        currencyId: "",
        startDate: "",
        endDate: "",
        page: 1,
        pageSize: 10,
        sortBy: "CreatedDate",
        sortDirection: "desc",
    });

    // Fetch properties from API
    const fetchProperties = useCallback(async (customFilters = null) => {
        setLoading(true);
        try {
            const response = await getProperties(customFilters || filters);
            if (response.success && response.data && response.data.data) {
                setProperties(response.data.data);
            } else {
                setProperties([]);
            }
        } catch (error) {
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Update filters and fetch
    const updateFilters = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            searchTerm: "",
            propertyTypeId: "",
            propertyStatusId: "",
            minPrice: "",
            maxPrice: "",
            currencyId: "",
            startDate: "",
            endDate: "",
            page: 1,
            pageSize: 10,
            sortBy: "CreatedDate",
            sortDirection: "desc",
        });
    };

    return (
        <RealEstateContext.Provider
            value={{ properties, loading, filters, fetchProperties, updateFilters, clearFilters }}
        >
            {children}
        </RealEstateContext.Provider>
    );
};

export const useRealEstate = () => useContext(RealEstateContext);