import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [college, setCollege] = useState('');
    const [branch, setBranch] = useState('');
    const [sectionCount, setSectionCount] = useState(1);
    const [errors, setErrors] = useState({});
    const [screenshot, setScreenshot] = useState(null);
    const navigate = useNavigate();

    const branchesByCollege = {
        'SISTec-GN': ['CSE', 'CSE - Cyber Security', 'CSE - AIML'],
        'SISTec-R': ['CSE', 'CSE - AIML'],
        'SISTec-E': ['CSE', 'CSE - IoT'],
    };

    const handleCollegeChange = (e) => {
        setCollege(e.target.value);
        setBranch('');
        setSectionCount(1);
    };

    const handleBranchChange = (e) => {
        const selectedBranch = e.target.value;
        setBranch(selectedBranch);

        if (college === 'SISTec-GN' && selectedBranch === 'CSE') {
            setSectionCount(4);
        } else if (college === 'SISTec-R' && selectedBranch === 'CSE') {
            setSectionCount(2);
        } else {
            setSectionCount(1);
        }
    };

    const handleScreenshotChange = (e) => {
        setScreenshot(e.target.files[0]);

        if (e.target.files[0] && e.target.files[0].size > 5000000) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                screenshot: 'File size should not exceed 5MB',
            }));
        } else {
            setErrors((prevErrors) => {
                const { screenshot, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const enrollment = document.getElementById('enrollment').value;
        const transaction = document.getElementById('transaction').value;

        if (!name) {
            newErrors.name = 'Name is required';
        }

        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Valid email is required';
        }

        if (!enrollment || enrollment.length !== 12) {
            newErrors.enrollment = 'Enrollment number must be 12 characters long';
        }

        if (!transaction) {
            newErrors.transaction = 'Transaction ID is required';
        }

        if (!screenshot) {
            newErrors.screenshot = 'Screenshot of payment is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('enrollment', document.getElementById('enrollment').value);
        formData.append('college', college);
        formData.append('branch', branch);
        formData.append('year', document.getElementById('year').value);
        formData.append('section', document.getElementById('section').value);
        formData.append('league', getLeague());
        formData.append('transaction', document.getElementById('transaction').value);
        formData.append('screenshot', screenshot);

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                navigate('/');
            } else {
                alert(data.error || 'Something went wrong.');
            }
        } catch (error) {
            alert('Server error. Please try again later.');
        }
    };

    const getLeague = () => {
        if (['CSE - AIML', 'CSE - IoT', 'CSE - Cyber Security', 'CSE - AIDL'].includes(branch)) {
            return 'Python Premier League (PPL)';
        }
        return 'Java Premier League (JPL)';
    };

    return (
        <div className="registration-fullRegister">
            <div className="registration-form-container">
                <h2>Registration Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="registration-form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={errors.name ? 'registration-error-border' : ''}
                        />
                        {errors.name && <span className="registration-error">{errors.name}</span>}
                    </div>
                    <div className="registration-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={errors.email ? 'registration-error-border' : ''}
                        />
                        {errors.email && <span className="registration-error">{errors.email}</span>}
                    </div>
                    <div className="registration-form-group">
                        <label htmlFor="enrollment">Enrollment Number</label>
                        <input
                            type="text"
                            id="enrollment"
                            name="enrollment"
                            className={errors.enrollment ? 'registration-error-border' : ''}
                        />
                        {errors.enrollment && <span className="registration-error">{errors.enrollment}</span>}
                    </div>
                    <div className="registration-form-group">
                        <label htmlFor="college">College</label>
                        <select
                            id="college"
                            value={college}
                            onChange={handleCollegeChange}
                            className={errors.college ? 'registration-error-border' : ''}
                            required
                        >
                            <option value="">Select College</option>
                            <option value="SISTec-GN">SISTec-GN</option>
                            <option value="SISTec-R">SISTec-R</option>
                            <option value="SISTec-E">SISTec-E</option>
                        </select>
                    </div>
                    {college && (
                        <div className="registration-form-group">
                            <label htmlFor="branch">Branch</label>
                            <select
                                id="branch"
                                value={branch}
                                onChange={handleBranchChange}
                                className={errors.branch ? 'registration-error-border' : ''}
                                required
                            >
                                <option value="">Select Branch</option>
                                {branchesByCollege[college].map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="registration-form-group">
                        <label htmlFor="year">Year</label>
                        <select id="year" required>
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                        </select>
                    </div>
                    {branch && (
                        <div className="registration-form-group">
                            <label htmlFor="section">Section</label>
                            <select id="section" required>
                                {[...Array(sectionCount)].map((_, i) => (
                                    <option key={i + 1} value={`Section ${i + 1}`}>
                                        Section {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {branch && (
                        <div className="registration-form-group">
                            <label htmlFor="league">League</label>
                            <input type="text" id="league" value={getLeague()} readOnly />
                        </div>
                    )}
                    <div className="registration-form-group">
                        <label htmlFor="transaction">Transaction ID</label>
                        <input
                            type="text"
                            id="transaction"
                            name="transaction"
                            className={errors.transaction ? 'registration-error-border' : ''}
                        />
                        {errors.transaction && <span className="registration-error">{errors.transaction}</span>}
                    </div>
                    <div className="registration-form-group">
                        <label htmlFor="screenshot">Screenshot of Payment</label>
                        <input
                            type="file"
                            id="screenshot"
                            name="screenshot"
                            onChange={handleScreenshotChange}
                            className={errors.screenshot ? 'registration-error-border' : ''}
                            required
                        />
                        {errors.screenshot && <span className="registration-error">{errors.screenshot}</span>}
                    </div>
                    <button type="submit" className='registration-btn-submit'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
