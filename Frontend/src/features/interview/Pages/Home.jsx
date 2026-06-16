import React,{useState,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import "../style/home.scss"
import { useInterview } from '../hooks/useinterview';

const Home = () => {
    const { handleGenerateReport, } = useInterview();
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const resumeRef = useRef(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const resume = resumeRef.current.files[0];
        console.log({ jobDescription, selfDescription, resume });
        try {
            const data = await handleGenerateReport({ selfDescription, jobDescription, resume });
           
            console.log("GENERATED REPORT =", data);
           navigate('/interview', {
    state: {
        report: data.report
    }
});
        } catch (err) {
            console.error('Failed to generate interview report:', err);
        }
    };

    return (
        <main className='home'>

            <div className="interview-input-group">
          <div className="left">
              <div className="input-group">
                <label htmlFor="jobDescription">Enter job description</label>
                <textarea 
                    name="jobDescription" 
                    id="jobDescription" 
                    placeholder="Enter job description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
            </div>
            </div>

            <div className="right">
                
                   <div onChange={(e)=>setSelfDescription(e.target.value)}
                   className="input-group">
                    <label htmlFor="selfDescription" >Self Description</label>
                    <textarea name="selfDescription" id="selfDescription" placeholder="Enter self description" value={selfDescription} onChange={(e) => setSelfDescription(e.target.value)}></textarea>
                   
                       </div>
                   
            </div>

           <div className="bottom">
           <div className="input-group">
             <label className='resume' htmlFor="resume">Upload Resume</label>
            <input ref={resumeRef} hidden type="file" id="resume" name="resume"  accept='.pdf'/>
            <button onClick={handleSubmit} type="submit">Generate Interview Report</button>

           </div>
           
           </div>

            </div>

          
        </main>
    )}

export default Home;