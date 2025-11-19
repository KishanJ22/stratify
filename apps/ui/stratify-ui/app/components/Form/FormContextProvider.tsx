"use client";

import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

export interface FormContextValues {
    isSubmitDisabled: boolean;
    setIsSubmitDisabled: Dispatch<SetStateAction<boolean>>;
    isSubmitProcessing: boolean;
    setIsSubmitProcessing: Dispatch<SetStateAction<boolean>>;
}

export const FormContext = createContext<FormContextValues | undefined>(
    undefined,
);

export const FormContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isSubmitProcessing, setIsSubmitProcessing] = useState(false);

    const formContextVars = {
        isSubmitDisabled,
        setIsSubmitDisabled,
        isSubmitProcessing,
        setIsSubmitProcessing,
    };

    return (
        <FormContext.Provider value={formContextVars}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);

    if (context === undefined) {
        throw new Error(
            "useFormContext must be used within a FormContextProvider",
        );
    }

    return context;
};
