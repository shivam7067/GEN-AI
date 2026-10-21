import { useContext } from "react";
import { InterviewContext } from "../Interview.context";
import { generateReport, getReportById } from "../Services/Interview.api";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { interviewReport, setInterviewReport, loading, setLoading } = context;

    const handleGenerateReport = async ({ selfDescription, jobDescription, resume }) => {
        setLoading(true);
        try {
            setInterviewReport(null);
            const data = await generateReport({ selfDescription, jobDescription, resume });
            const report = data.report || data.interviewReport || data;
            setInterviewReport(report);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const handleGetReportById = async (interviewId) => {
        setLoading(true);
        try {
            const data = await getReportById(interviewId);
            const report = data.report || data.interviewReport || data;
            setInterviewReport(report);
            return report;
        } finally {
            setLoading(false);
        }
    };

    return {
        interviewReport,
        setInterviewReport,
        loading,
        setLoading,
        handleGenerateReport,
        handleGetReportById
    };
};