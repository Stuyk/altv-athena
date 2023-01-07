export const CHAT_CONFIG = {
    settings: {
        // Maximum range for another player to speak to another player
        range: 15,
    },
    behavior: {
        // Auto-scroll to bottom on new message
        scroll: true,
        // Show message indexes
        messageIndexes: true,
        // Default by showing timestamps
        timestamps: true,
        // Total messages to show on-screen
        display: 6,
        // Message length
        length: 128,
    },
    style: {
        // Max width of the message box
        'max-width': '400px',
        // Font size of the individual message
        'font-size': '13px',
        // The boldness of the message
        'font-weight': 600,
        // The transparency of a message
        opacity: 0.95,
    },
};
