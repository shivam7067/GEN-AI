import { useContext } from "react";
import { InterviewContext } from "../Interview.context";
import { generateReport,getReportById } from "../services/interview.api";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewReport, setInterviewReport, loading, setLoading } = context;

    const handleGenerateReport = async ({ selfDescription, jobDescription, resume }) => {
        setLoading(true);
        try {
            setInterviewReport(null);
            const data = await generateReport({ selfDescription, jobDescription, resume });
            console.log("API RESPONSE =", data);
            const report = data.interviewReport || data;
            console.log("GENERATED REPORT =", report);
            setInterviewReport(report);
            return report;
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetReportById = async (interviewId) => {
        setLoading(true);
        try {
            const data = await getReportById(interviewId);
            const report = data.interviewReport || data;
            setInterviewReport(report);
            return report;
        } catch (err) {
            console.log(err);
            throw err;
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
}