import { createContext,useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [interviewReport, setInterviewReport] = useState(null);
    const [loading, setLoading] = useState(false);

    return(
        <InterviewContext.Provider value={{ interviewReport, setInterviewReport, loading, setLoading }}>
            {children}
        </InterviewContext.Provider>    
    )
}