import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const { getToken } = useAuth(); // Clerk JWT

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Load company token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('companyToken')
    if (token) {
      setCompanyToken(token)
      console.log('✅ Loaded company token from localStorage')
    }
  }, [])

  // 🔹 Fetch jobs (public route, no auth needed)
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    }
  };

  // 🔹 Auto-fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        showRecruiterLogin,
        setShowRecruiterLogin,
        jobs,
        searchFilter,
        setSearchFilter,
        isSearched,
        setIsSearched,
        backendUrl,
        companyToken,
        setCompanyToken,
        companyData,
        setCompanyData,
        fetchJobs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;