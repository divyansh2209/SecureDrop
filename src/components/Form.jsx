import React, { useState } from 'react';
import { db, storage } from "../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const Form = () => {
    const [inputText, setInputText] = useState('');
    const [password, setPassword] = useState('');

    const [id, setId] = useState('');
    const [copied, setCopied] = useState(false);

    const [options, setOptions] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);

    const copyToClipBoard = (str) => {
        setCopied(true)

        navigator.clipboard.writeText(str).then(() => {
            setTimeout(() => setCopied(false), 1000);
        },
            (err) => {
                console.log(err)
            }
        )
    }

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 5) {
            errors.push("Password must be at least 5 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one capital letter.");
        }
        return errors;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordErrors(validatePassword(newPassword));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputText);

        const passwordValidationErrors = validatePassword(password);
        if (passwordValidationErrors.length > 0) {
            setPasswordErrors(passwordValidationErrors);
            return;
        } else {
            setPasswordErrors([]);
        }

        // Generate id outside setId to ensure it is available immediately
        const newId = uuidv4();
        setId(newId);

        let data = {
            message: inputText,
        }
        if (password) {
            data.password = password; // Add password to data object if not empty
        }

        try {
            await setDoc(doc(db, "texts", newId), data);
            setInputText('');
            setPassword('');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <div className='w-full'>
                <form className='p-3 bg-[#364156] flex flex-col justify-center items-center' onSubmit={handleSubmit}>
                    {/* <label className='text-white mb-2'>Enter text:</label> */}
                    <textarea
                        className='mb-5 p-2 mt-1 w-9/12 rounded-lg resize-none text-black bg-[#e5e5e5] focus:outline-none focus:ring focus:border-indigo-500'
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        rows={4} // Specify the number of rows here
                        placeholder='Enter your text...'
                    />

                    <div className='w-9/12 py-2 flex flex-col justify-start items-start'>
                        <button onClick={() => setOptions(!options)} className='text-white text-lg cursor-pointer pb-2'>Show Options:</button>
                        {options && (
                            <div>
                                <label className='text-white text-lg font-semibold'> Password: </label>
                                <input onChange={handlePasswordChange} value={password} type="password" className="mb-2 p-2 rounded-lg text-black bg-[#e5e5e5] focus:outline-none focus:ring focus:border-indigo-500" />
                                {passwordErrors.length > 0 && (
                                    <div className='text-red-500'>
                                        {passwordErrors.map((error, index) => (
                                            <p key={index}>{error}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Create Link
                        </button>

                    </div>
                </form>
            </div>



            {id && (
                <div className='p-3 rounded-lg bg-[#495057] mb-2'>
                    <p onClick={() => copyToClipBoard(`https://secretgenerator.web.app/secret/${id}`)} className='text-red-300 cursor-pointer font-bold'>
                        {`https://secretgenerator.web.app/secret/${id}`}
                    </p>
                    {copied && <span className="text-green-500">Copied to clipboard!</span>}
                </div>
            )}
        </div>
    );
}

export default Form;
