import { defaultConfig, defineConfig, createSystem } from '@chakra-ui/react'

const config = defineConfig({
    theme: {
        extend: {
            globalStyles: {
                html: {
                    colorPalette: "blue", // Change this to any color palette you prefer
                },
            },
        },
        semanticTokens: {
            colors: {
                bg: {
                    muted: { 
                        value: { _light: "{colors.gray.100}", _dark: "{colors.gray.900}" },
                    },
                },
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)