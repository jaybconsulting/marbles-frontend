import { Box, Center, Heading } from '@chakra-ui/react';
import GoogleLogin from './GoogleLogin';

export default function Login() {

  return (
    <Box
        position='relative'
    >
        <Center
            height='100vh'
        >
            <Box
                outline='1px solid'
                borderRadius='1rem'
                display='flex'
                flexDirection='column'
                alignItems='space-between'
                gap='1rem'
                padding='2rem'
            >
                <Heading
                    style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                    }}
                >
                    Login to Marbles
                </Heading>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    mt='1rem'
                >
                    <GoogleLogin />
                </Box>
            </Box>
        </Center>
    </Box>
  );
}