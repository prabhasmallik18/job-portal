import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddJob = () => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);
    const [skills, setSkills] = useState('');

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const { backendUrl, companyToken } = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const description = quillRef.current.root.innerHTML;
            const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
            const { data } = await axios.post(backendUrl + '/api/company/post-job', 
                { title, description, location, category, level, salary, skills: skillsArray },
                { headers: { token: companyToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setTitle('');
                setSalary(0);
                setSkills('');
                quillRef.current.root.innerHTML = "";
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
        }
    }, []);

    return (
        <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
            <div className='w-full'>
                <p className='mb-2'>Job Title</p>
                <input className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' type="text" placeholder='Type here' onChange={e => setTitle(e.target.value)} value={title} required />
            </div>

            <div className='w-full max-w-lg'>
                <p className='mb-2'>Job Description</p>
                <div ref={editorRef}></div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                <div>
                    <p className='mb-2'>Job Category</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)}>
                        <option value="Programming">Programming</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Networking">Networking</option>
                        <option value="Management">Management</option>
                        <option value="CyberSecurity">CyberSecurity</option>
                        <option value="Designing">Designing</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Job Location</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Washington">Washington</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Job Level</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLevel(e.target.value)}>
                        <option value="Beginner level">Beginner level</option>
                        <option value="Intermediate level">Intermediate level</option>
                        <option value="Senior level">Senior level</option>
                    </select>
                </div>
            </div>

            <div>
                <p className='mb-2'>Job Salary</p>
                <input min={0} className='w-full sm:w-[120px] px-3 py-2 border-2 border-gray-300 rounded' type="Number" placeholder='2500' onChange={e => setSalary(e.target.value)} value={salary} />
            </div>

            <div className='w-full'>
                <p className='mb-2'>Required Skills (Comma separated)</p>
                <input className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded' type="text" placeholder='e.g. React, Node.js, MongoDB, JavaScript' onChange={e => setSkills(e.target.value)} value={skills} />
            </div>

            <button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>
        </form>
    )
}
export default AddJob