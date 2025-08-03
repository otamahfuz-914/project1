import React from 'react';
import ReactDOM from 'react-dom';

interface PuterPermissionModalProps {
    permissionName: string;
    onClose: () => void;
}

export const PuterPermissionModal: React.FC<PuterPermissionModalProps> = ({ permissionName, onClose }) => {
    const modalRoot = document.getElementById('puter-permission-modal-container');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">অনুমতি প্রয়োজন</h3>
                <div className="mt-2 text-gray-600">
                    <p>এই ফিচারটি ব্যবহার করার জন্য আপনার "{permissionName}" ব্যবহারের অনুমতি প্রয়োজন।</p>
                    <p className="mt-2 text-sm text-gray-500">
                        অনুগ্রহ করে আপনার ব্রাউজার বা সিস্টেম সেটিংসে এই অ্যাপের জন্য ক্যামেরা অনুমতি সক্রিয় করুন।
                    </p>
                </div>
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                        বুঝেছি
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
    );
};
