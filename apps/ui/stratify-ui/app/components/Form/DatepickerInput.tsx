"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/app/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/popover";
import { format } from "date-fns";
import { useFieldContext } from "./useForm";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerInputProps {
    label: string;
    id: string;
    placeholder?: string;
    error?: string;
    className?: string;
}

function DatePickerInput({
    label,
    id,
    placeholder = "Select a date",
    error,
    className,
}: DatePickerInputProps) {
    const field = useFieldContext<string | undefined>();
    const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);

    return (
        <Field className={`flex flex-col gap-y-1.5 ${className}`}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Popover open={isDatepickerOpen} onOpenChange={setIsDatepickerOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        id={id}
                        className="justify-start font-sans font-normal bg-white text-primary-dark w-full border border-secondary-dark rounded-md"
                    >
                        <CalendarIcon className="text-secondary-dark" />
                        {field.state.value ? (
                            <span className="text-secondary-dark">
                                {format(field.state.value, "PPP")}
                            </span>
                        ) : (
                            <span className="text-secondary-light">
                                {placeholder}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={new Date(field.state.value ?? "")}
                        onSelect={(date) => {
                            field.handleChange(date?.toISOString());
                            setIsDatepickerOpen(false);
                        }}
                        onDayBlur={() => field.handleBlur()}
                        defaultMonth={
                            field.state.value
                                ? new Date(field.state.value)
                                : undefined
                        }
                    />
                </PopoverContent>
            </Popover>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}

export default DatePickerInput;
