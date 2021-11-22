export default [
    {
        id: 'name',
        desc: 'Your Name',
        type: 'text',
        placeholder: 'John_Doe',
        error: 'Must have underscore. Example: John_Doe',
        regex: /^([A-Z][a-z]+_[A-Z][a-z]+)$/gm, // John_Doe
    },
    {
        id: 'age',
        desc: 'Your Age',
        type: 'number',
        placeholder: 25,
        error: 'Value must be between 0 and 100',
        regex: /^(([2-9][0-9]{1})|(1[8-9]))$/gm, // 0 - 100
    },
    {
        id: 'optional',
        desc: '*Optional',
        type: 'text',
        placeholder: 'Whatever',
    },
];
