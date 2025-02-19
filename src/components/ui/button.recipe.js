import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
    name: 'button',
    base: {
        borderRadius: 20,
        bg: 'bg.button',
        color: 'text.button',
        fontSize: '14px',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        _hover: {
            bg: 'bg.buttonHover',
            cursor: 'pointer',
        },
    },
    variants: {
        visual: {
            solid: {
                bg: 'bg.button',
                _hover: {
                    bg: 'bg.buttonHover',
                },
            },
            outline: {
                bg: 'transparent',
                border: '1px solid',
                borderColor: 'bg.button',
                color: 'colors.white',
                _hover: {
                    bg: 'transparent',
                },
            },
        },
    },
});