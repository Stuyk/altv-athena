const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

export default {
    tagBody,
    tagOrComment: new RegExp(
        '<(?:' +
            // Comment body.
            '!--(?:(?:-*[^->])*--+|-?)' +
            // Special "raw text" elements whose content should be elided.
            '|script\\b' +
            tagBody +
            '>[\\s\\S]*?</script\\s*' +
            '|style\\b' +
            tagBody +
            '>[\\s\\S]*?</style\\s*' +
            // Regular name
            '|/?[a-z]' +
            tagBody +
            ')>',
        'gi',
    ),
};
