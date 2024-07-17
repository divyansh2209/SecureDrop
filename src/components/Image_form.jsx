import React, { useState } from 'react';
import { db, storage } from "../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";

const Image_form = () => {
    const [imageUpload, setImageUpload] = useState(null);
    const [id, setId] = useState('');
    const [copied, setCopied] = useState(false);
    const [options, setOptions] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [password, setPassword] = useState('');

    const copyToClipBoard = (str) => {
        setCopied(true);
        navigator.clipboard.writeText(str).then(() => {
            setTimeout(() => setCopied(false), 2000);
        }, (err) => {
            console.log(err);
        });
    };

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

    const uploadFile = async () => {
        if (!imageUpload) return;

        const passwordValidationErrors = validatePassword(password);
        if (passwordValidationErrors.length > 0) {
            setPasswordErrors(passwordValidationErrors);
            return;
        } else {
            setPasswordErrors([]);
        }

        const newId = uuidv4();
        setId(newId);

        const imageRef = ref(storage, `images/${newId}`);
        await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(imageRef);

        // Save the image URL and ID in Firestore
        await setDoc(doc(db, "images", newId), {
            imageUrl: url,
            id: newId,
            password: password
        });

        console.log('Image uploaded and URL saved to Firestore:', { newId, url });
    };

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <div className='p-8 bg-[#364156]'>
                <input
                    type="file"
                    className='mb-5 mr-5 text-brown-50'
                    onChange={(event) => {
                        setImageUpload(event.target.files[0]);
                    }}
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
                <button className='flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' onClick={uploadFile}>Create Link</button>
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

export default Image_form;
