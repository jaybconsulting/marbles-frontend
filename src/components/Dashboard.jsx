import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { 
    Box, 
    Container, 
    Heading, 
    Stat, 
    Text,
} from '@chakra-ui/react';

export default function Dashboard() {
    const { user } = useContext(UserContext);

    return (
        <Container maxW="container.xl" py={8}>
            <Heading mb={6} size="lg">
                Welcome, {user.firstName}!
            </Heading>
            
            <Box
                p={6}
                display="flex"
                flexDirection="column"
                gap={4}
            >
                <Text 
                    fontSize="xl" 
                    fontWeight="medium" 
                    mb={4}
                >
                    Game Statistics
                </Text>
                <Stat.Root>
                    <Stat.Label fontSize="md" color="green.500">Wins</Stat.Label>
                    <Stat.ValueText fontSize="3xl">
                        {user.wins || 0}
                    </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                    <Stat.Label fontSize="md" color="red.500">Losses</Stat.Label>
                    <Stat.ValueText fontSize="3xl">
                        {user.losses || 0}
                    </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                    <Stat.Label fontSize="md" color="blue.500">Total Games</Stat.Label>
                    <Stat.ValueText fontSize="3xl">
                        {(user.wins || 0) + (user.losses || 0)}
                    </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                    <Stat.Label fontSize="md" color="purple.500">Win Rate</Stat.Label>
                    <Stat.ValueText fontSize="3xl">
                        {user.wins || user.losses ? 
                            `${Math.round((user.wins / (user.wins + user.losses)) * 100)}%` 
                            : '0%'}
                    </Stat.ValueText>
                </Stat.Root>
            </Box>
        </Container>
    );
}