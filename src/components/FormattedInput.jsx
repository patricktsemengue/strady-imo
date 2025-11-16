import React, { useState } from 'react';

const FormattedInput = ({
    name,
    value,
    onChange: passUpstream,
    onFocus,
    onBlur,
    unit,
    placeholder,
    className = '',
    required = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e) => {
        const { value: rawValue } = e.target;
        const number = parseFloat(rawValue);

        // If the value is a number and it's negative, do not update.
        if (!isNaN(number) && number < 0) {
            return;
        }
        passUpstream(e);
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const formatValue = (val) => {
        if (isFocused || val === '' || val === null || val === undefined) {
            return val;
        }
        const number = parseFloat(val);
        if (isNaN(number)) return val;

        const formattedNumber = new Intl.NumberFormat('fr-BE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(number);
        return `${formattedNumber} ${unit}`;
    };

    return (
        <input
            type={isFocused ? 'number' : 'text'}
            name={name}
            value={isFocused ? value : formatValue(value)}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`mt-1 w-full p-2 border rounded-md ${className}`}
            min="0"
            required={required}
        />
    );
};

export default FormattedInput;