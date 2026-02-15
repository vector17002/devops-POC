import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const aj = arcjet({
    key: process.env.ARCJET_KEY || '',
    rules: [
        shield({ mode: process.env.NODE_ENV === 'development' ? 'DRY_RUN' : 'LIVE' }),
        detectBot({
            mode: process.env.NODE_ENV === 'development' ? 'DRY_RUN' : 'LIVE',
            allow: [
                "CATEGORY:MONITOR", // UPTIME MONITORING SERVICES.
                "CATEGORY:PREVIEW", // LINK PREVIEW SUCH AS SOCIAL MEDIA.
                "CATEGORY:TOOL",    // Allow tools like Postman and curl in development
            ]
        }),
        slidingWindow({
            mode: 'LIVE',
            interval: '2s',
            max: 5
        })
    ]
})

export default aj;