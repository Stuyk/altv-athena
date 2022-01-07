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
    {
        id: 'gender',
        desc: 'Your gender',
        type: 'choice',
        placeholder: 'male',
        error: 'Select male or female',
        choices: [
            { text: 'male', value: 'male' },
            { text: 'female', values: 'female' },
        ],
    },
    {
        id: 'mate',
        desc: 'Fav mate',
        type: 'choice',
        placeholder: 'male',
        error: 'Select male or female',
        choices: [
            { text: 'male', value: 'male' },
            { text: 'female', values: 'female' },
        ],
    },
    {
        id: 'randomize',
        desc: 'Should this peds apperance be randomized?',
        placeholder: '',
        type: 'choice',
        error: '',
        choices: [
            { text: 'Yes', value: 'true' },
            { text: 'No', value: 'false' },
        ],
    },
    {
        id: 'textlabel',
        desc: 'Should this ped have an Textlabel?',
        placeholder: '',
        type: 'choice',
        error: '',
        choices: [
            { text: 'Yes', value: 'true' },
            { text: 'No', value: 'false' },
        ],
    },
];
