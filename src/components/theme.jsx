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
                    button: {
                        value: { _light: "{colors.blue.500}", _dark: "{colors.blue.200}" },
                    },
                    buttonHover: {
                        value: { _light: "{colors.blue.600}", _dark: "{colors.blue.300}" },
                    },
                },
                text: {
                    button: {
                        value: { _light: "{colors.white}", _dark: "{colors.black}" },
                    },
                },
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)